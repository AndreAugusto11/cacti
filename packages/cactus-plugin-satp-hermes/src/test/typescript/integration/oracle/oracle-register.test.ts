import "jest-extended";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import {
  pruneDockerAllIfGithubAction,
  Containers,
} from "@hyperledger/cactus-test-tooling";
import {
  SATPGatewayConfig,
  SATPGateway,
  PluginFactorySATPGateway,
  OracleExecuteRequestTaskTypeEnum,
  OracleTaskStatusEnum,
  OracleRegisterRequestTaskModeEnum,
  OracleTaskTypeEnum,
  OracleTaskModeEnum,
  OracleOperationStatusEnum,
  OracleOperationTypeEnum,
} from "../../../../main/typescript";
import {
  Address,
  GatewayIdentity,
} from "../../../../main/typescript/core/types";
import {
  IPluginFactoryOptions,
  PluginImportType,
} from "@hyperledger/cactus-core-api";
import { ClaimFormat } from "../../../../main/typescript/generated/proto/cacti/satp/v02/common/message_pb";
import { BesuTestEnvironment, EthereumTestEnvironment, FabricTestEnvironment } from "../../test-utils";
import {
  SATP_ARCHITECTURE_VERSION,
  SATP_CORE_VERSION,
  SATP_CRASH_VERSION,
} from "../../../../main/typescript/core/constants";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { v4 as uuidv4 } from "uuid";
import OracleTestContract from "../../../solidity/generated/oracle-contract.sol/OracleTestContract.json";
import { keccak256 } from "web3-utils";
import { BLODispatcher } from "../../../../main/typescript/api1/dispatcher";

const logLevel: LogLevelDesc = "DEBUG";
const log = LoggerProvider.getOrCreate({
  level: logLevel,
  label: "SATP - Hermes",
});

let besuEnv: BesuTestEnvironment;
let ethereumEnv: EthereumTestEnvironment;
let fabricEnv: FabricTestEnvironment
let gateway: SATPGateway;
let dispatcher: BLODispatcher;
let besuContractAddress: string;
let ethereumContractAddress: string;
let data_hash: string;

beforeAll(async () => {
  pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });

  {
    const businessLogicContract = "OracleTestContract";

    try {
      besuEnv = await BesuTestEnvironment.setupTestEnvironment(
        businessLogicContract,
        logLevel,
      );
      log.info("Besu Ledger started successfully");

      ethereumEnv = await EthereumTestEnvironment.setupTestEnvironment(
        businessLogicContract,
        logLevel,
      );

      fabricEnv = await FabricTestEnvironment.setupTestEnvironment(
        businessLogicContract,
        logLevel,
      );
    } catch (err) {
      log.error("Error starting Besu Ledger: ", err);
    }

    besuContractAddress = await besuEnv.deployAndSetupOracleContracts(
      ClaimFormat.BUNGEE,
      "OracleTestContract",
      OracleTestContract,
    );

    ethereumContractAddress = await ethereumEnv.deployAndSetupOracleContracts(
      ClaimFormat.BUNGEE,
      "OracleTestContract",
      OracleTestContract,
    );

    await fabricEnv.deployAndSetupContracts(
      ClaimFormat.BUNGEE,
    );
  }

  //setup satp gateway
  const factoryOptions: IPluginFactoryOptions = {
    pluginImportType: PluginImportType.Local,
  };
  const factory = new PluginFactorySATPGateway(factoryOptions);

  const gatewayIdentity = {
    id: "mockID",
    name: "CustomGateway",
    version: [
      {
        Core: SATP_CORE_VERSION,
        Architecture: SATP_ARCHITECTURE_VERSION,
        Crash: SATP_CRASH_VERSION,
      },
    ],
    proofID: "mockProofID10",
    address: "http://localhost" as Address,
  } as GatewayIdentity;

  const ethNetworkOptions = ethereumEnv.createEthereumConfig();
  const besuNetworkOptions = besuEnv.createBesuConfig();
  const fabricNetworkOptions = fabricEnv.createFabricConfig();

  const options: SATPGatewayConfig = {
    instanceId: uuidv4(),
    logLevel: "DEBUG",
    gid: gatewayIdentity,
    ccConfig: {
      oracleConfig: [ethNetworkOptions, besuNetworkOptions, fabricNetworkOptions],
    },
    pluginRegistry: new PluginRegistry({ plugins: [] }),
  };
  gateway = await factory.create(options);
  expect(gateway).toBeInstanceOf(SATPGateway);

  const identity = gateway.Identity;
  // default servers
  expect(identity.gatewayServerPort).toBe(3010);
  expect(identity.gatewayClientPort).toBe(3011);
  expect(identity.address).toBe("http://localhost");
  await gateway.startup();

  dispatcher = gateway.BLODispatcherInstance!;
  expect(dispatcher).toBeTruthy();
});

afterAll(async () => {
  await gateway.shutdown();
  await besuEnv.tearDown();
  await ethereumEnv.tearDown();
  await fabricEnv.tearDown();

  await pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });
});

describe("Oracle registering READ, UPDATE, and READ_AND_UPDATE tasks successfully", () => {
  it("should read data from a solidity contract calling a function with args with polling mode (5 seconds)", async () => {
    data_hash = keccak256("Hello World!");

    const response = await dispatcher?.OracleRegisterTask({
      destinationNetworkId: besuEnv.network,
      destinationContract: {
        contractName: besuEnv.getTestContractName(),
        contractAddress: besuContractAddress,
        contractAbi: OracleTestContract.abi,
        contractBytecode: OracleTestContract.bytecode.object,
        methodName: "setData",
        params: [data_hash],
      },
      taskType: OracleExecuteRequestTaskTypeEnum.Update,
      taskMode: OracleRegisterRequestTaskModeEnum.Polling,
      pollingInterval: 5000,
    });

    expect(response).toBeDefined();
    expect(response?.id).toBeDefined();
    expect(response?.operations?.length).toBe(0);
    expect(response?.type).toBe(OracleTaskTypeEnum.Update);
    expect(response?.mode).toBe(OracleTaskModeEnum.Polling);

    await new Promise((resolve) => setTimeout(resolve, 23000));

    dispatcher?.OracleUnregisterTask({
      taskID: response?.id,
    });

    const readNonceTask = await dispatcher?.OracleExecuteTask({
      sourceNetworkId: besuEnv.network,
      sourceContract: {
        contractName: besuEnv.getTestContractName(),
        contractAddress: besuContractAddress,
        contractAbi: OracleTestContract.abi,
        contractBytecode: OracleTestContract.bytecode.object,
        methodName: "getNonce",
        params: [],
      },
      taskType: OracleExecuteRequestTaskTypeEnum.Read,
    });

    const task = dispatcher?.getOracleManager().getTask(response?.id ?? "");
    expect(task).toBeDefined();
    expect(task?.id).toBe(response?.id);
    expect(task?.status).toBe(OracleTaskStatusEnum.Inactive);
    expect(task?.operations?.length).toBe(4);

    for (const operation of task?.operations ?? []) {
      expect(operation.status).toBe(OracleOperationStatusEnum.Success);
      expect(operation.type).toBe(OracleOperationTypeEnum.Update);
    }

    expect(readNonceTask).toBeDefined();
    expect(readNonceTask?.id).toBeDefined();
    expect(readNonceTask?.operations?.length).toBe(1);
    expect(readNonceTask?.type).toBe(OracleTaskTypeEnum.Read);
    expect(readNonceTask?.operations?.[0].status).toBe(
      OracleOperationStatusEnum.Success,
    );
    expect(readNonceTask?.operations?.[0].output?.output).toBe("4");
  });

  it("should read data from a fabric contract calling a function with args with polling mode (5 seconds)", async () => {
    data_hash = keccak256("Hello World!");

    const response = await dispatcher?.OracleRegisterTask({
      destinationNetworkId: fabricEnv.network,
      destinationContract: {
        contractName: fabricEnv.getTestContractName(),
        methodName: "Mint",
        params: ['500'],
      },
      taskType: OracleExecuteRequestTaskTypeEnum.Update,
      taskMode: OracleRegisterRequestTaskModeEnum.Polling,
      pollingInterval: 5000,
    });

    expect(response).toBeDefined();
    expect(response?.id).toBeDefined();
    expect(response?.operations?.length).toBe(0);
    expect(response?.type).toBe(OracleTaskTypeEnum.Update);
    expect(response?.mode).toBe(OracleTaskModeEnum.Polling);

    await new Promise((resolve) => setTimeout(resolve, 23000));

    dispatcher?.OracleUnregisterTask({
      taskID: response?.id,
    });

    const readBalanceTask = await dispatcher?.OracleExecuteTask({
      sourceNetworkId: fabricEnv.network,
      sourceContract: {
        contractName: fabricEnv.getTestContractName(),
        methodName: "ClientAccountBalance",
        params: [],
      },
      taskType: OracleExecuteRequestTaskTypeEnum.Read,
    });

    const task = dispatcher?.getOracleManager().getTask(response?.id ?? "");
    expect(task).toBeDefined();
    expect(task?.id).toBe(response?.id);
    expect(task?.status).toBe(OracleTaskStatusEnum.Inactive);
    expect(task?.operations?.length).toBe(4);

    for (const operation of task?.operations ?? []) {
      expect(operation.status).toBe(OracleOperationStatusEnum.Success);
      expect(operation.type).toBe(OracleOperationTypeEnum.Update);
    }

    expect(readBalanceTask).toBeDefined();
    expect(readBalanceTask?.id).toBeDefined();
    expect(readBalanceTask?.operations?.length).toBe(1);
    expect(readBalanceTask?.type).toBe(OracleTaskTypeEnum.Read);
    expect(readBalanceTask?.operations?.[0].status).toBe(
      OracleOperationStatusEnum.Success,
    );
    expect(readBalanceTask?.operations?.[0].output?.output).toBe("2000");
  });

  it("should read and update using an event listener for events in the source contract", async () => {
    const payload1 = "Hello World to Emit Event!";
    const payload2 = "Hello World to Emit Event 2!";

    // first, we will read the data from the destination contract and make sure the data is not there

    let response2;
    try {
      response2 = await besuEnv.readData(
        "OracleTestContract",
        besuContractAddress,
        OracleTestContract.abi,
        "getData",
        [keccak256(payload1)],
      );
    } catch (error) {
      log.info("Expected error occurred while reading data:", error);
      response2 = { success: false, callOutput: null };
    }

    expect(response2.success).toBeFalsy();
    expect(response2.callOutput).toBeNull();

    let response3;
    try {
      response3 = await besuEnv.readData(
        "OracleTestContract",
        besuContractAddress,
        OracleTestContract.abi,
        "getData",
        [keccak256(payload2)],
      );
    } catch (error) {
      log.info("Expected error occurred while reading data:", error);
      response3 = { success: false, callOutput: null };
    }

    expect(response3.success).toBeFalsy();
    expect(response3.callOutput).toBeNull();

    // we register the task to listen to the event and write the data to the destination contract

    const response = await dispatcher?.OracleRegisterTask({
      sourceNetworkId: ethereumEnv.network,
      sourceContract: {
        contractAbi: OracleTestContract.abi,
        contractAddress: ethereumContractAddress,
        eventSignature: "UpdatedData(string)",
      },
      destinationNetworkId: besuEnv.network,
      destinationContract: {
        contractName: besuEnv.getTestContractName(),
        contractAddress: besuContractAddress,
        contractAbi: OracleTestContract.abi,
        contractBytecode: OracleTestContract.bytecode.object,
        methodName: "setData",
        // we are not providing the params here because we are
        // listening to the event and we will get the data from the event
      },
      taskType: OracleExecuteRequestTaskTypeEnum.ReadAndUpdate,
      taskMode: OracleRegisterRequestTaskModeEnum.EventListening,
    });

    expect(response).toBeDefined();
    expect(response?.id).toBeDefined();
    expect(response?.operations?.length).toBe(0);
    expect(response?.type).toBe(OracleTaskTypeEnum.ReadAndUpdate);
    expect(response?.mode).toBe(OracleTaskModeEnum.EventListening);
    expect(
      dispatcher?.getOracleManager().getSchedulerManager().listListeners(),
    ).toContain(response?.id);

    // now the event listener is in place, so we will write data twice to the source contract to trigger the event

    await dispatcher?.OracleExecuteTask({
      destinationNetworkId: ethereumEnv.network,
      destinationContract: {
        contractName: ethereumEnv.getTestContractName(),
        contractAddress: ethereumContractAddress,
        contractAbi: OracleTestContract.abi,
        contractBytecode: OracleTestContract.bytecode.object,
        methodName: "setData",
        params: [payload1],
      },
      taskType: OracleExecuteRequestTaskTypeEnum.Update,
    });

    await dispatcher?.OracleExecuteTask({
      destinationNetworkId: ethereumEnv.network,
      destinationContract: {
        contractName: ethereumEnv.getTestContractName(),
        contractAddress: ethereumContractAddress,
        contractAbi: OracleTestContract.abi,
        contractBytecode: OracleTestContract.bytecode.object,
        methodName: "setData",
        params: [payload2],
      },
      taskType: OracleExecuteRequestTaskTypeEnum.Update,
    });

    // wait for both events to be processed and the task to be executed twice
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let task = dispatcher?.getOracleManager().getTask(response?.id ?? "");
    expect(task).toBeDefined();
    expect(task?.id).toBe(response?.id);
    expect(task?.status).toBe(OracleTaskStatusEnum.Active);
    expect(task?.operations?.length).toBe(2);
    expect(response?.operations?.[0].status).toBe(
      OracleOperationStatusEnum.Success,
    );
    expect(response?.operations?.[1].status).toBe(
      OracleOperationStatusEnum.Success,
    );

    // unregister the task and delete the event listener

    dispatcher.OracleUnregisterTask({
      taskID: response?.id ?? "",
    });

    // check that the task is no longer active

    task = dispatcher?.getOracleManager().getTask(response?.id ?? "");
    expect(task?.status).toBe(OracleTaskStatusEnum.Inactive);

    // read again from the destination contract to make sure the data written is there

    response2 = await besuEnv.readData(
      "OracleTestContract",
      besuContractAddress,
      OracleTestContract.abi,
      "getData",
      [keccak256(payload1)],
    );

    expect(response2.success).toBeTruthy();
    expect(response2.callOutput).toBe(payload1);

    response3 = await besuEnv.readData(
      "OracleTestContract",
      besuContractAddress,
      OracleTestContract.abi,
      "getData",
      [keccak256(payload2)],
    );

    expect(response3.success).toBeTruthy();
    expect(response3.callOutput).toBe(payload2);
  });
});
