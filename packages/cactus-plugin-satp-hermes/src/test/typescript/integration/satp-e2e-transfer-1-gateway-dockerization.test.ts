import "jest-extended";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { FabricContractInvocationType } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import {
  pruneDockerAllIfGithubAction,
  Containers,
  SATPGatewayRunner,
  ISATPGatewayRunnerConstructorOptions,
} from "@hyperledger/cactus-test-tooling";
import {
  EthContractInvocationType,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { Address, GatewayIdentity } from "../../../main/typescript/core/types";
import {
  createClient,
  setupGatewayDockerFiles,
  BesuTestEnvironment,
  FabricTestEnvironment,
  getTransactRequest,
  EthereumTestEnvironment,
  createPGDatabase,
  setupDBTable,
} from "../test-utils";
import {
  DEFAULT_PORT_GATEWAY_CLIENT,
  DEFAULT_PORT_GATEWAY_OAPI,
  DEFAULT_PORT_GATEWAY_SERVER,
  SATP_ARCHITECTURE_VERSION,
  SATP_CORE_VERSION,
  SATP_CRASH_VERSION,
} from "../../../main/typescript/core/constants";
import { ClaimFormat } from "../../../main/typescript/generated/proto/cacti/satp/v02/common/message_pb";
import { WHALE_ACCOUNT_ADDRESS } from "@hyperledger/cactus-test-geth-ledger";
import { Container } from "dockerode";
import { Knex } from "knex";
import { Configuration, LedgerType } from "@hyperledger/cactus-core-api";
import {
  GetApproveAddressApi,
  GetApproveAddressRequest,
  TokenType,
  TransactionApi,
} from "../../../main/typescript";

const logLevel: LogLevelDesc = "TRACE";
const log = LoggerProvider.getOrCreate({
  level: logLevel,
  label: "SATP - Hermes",
});

let besuEnv: BesuTestEnvironment;
let ethereumEnv: EthereumTestEnvironment;
let fabricEnv: FabricTestEnvironment;

const erc20TokenContract = "SATPContract";

let db_local_config: Knex.Config;
let db_remote_config: Knex.Config;
let db_local: Container;
let db_remote: Container;
let gatewayRunner: SATPGatewayRunner;

afterAll(async () => {
  await gatewayRunner.stop();
  await gatewayRunner.destroy();
  await db_local.stop();
  await db_local.remove();
  await db_remote.stop();
  await db_remote.remove();

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

beforeAll(async () => {
  pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });

  ({ config: db_local_config, container: db_local } = await createPGDatabase(
    5432,
    "user123123",
    "password",
  ));

  ({ config: db_remote_config, container: db_remote } = await createPGDatabase(
    5450,
    "user123123",
    "password",
  ));

  await setupDBTable(db_local_config);
  await setupDBTable(db_remote_config);

  {
    const satpContractName = "satp-contract";
    fabricEnv = await FabricTestEnvironment.setupTestEnvironment(
      satpContractName,
      logLevel,
    );
    log.info("Fabric Ledger started successfully");

    await fabricEnv.deployAndSetupContracts(ClaimFormat.DEFAULT);
  }

  {
    besuEnv = await BesuTestEnvironment.setupTestEnvironment(
      erc20TokenContract,
      logLevel,
    );
    log.info("Besu Ledger started successfully");

    await besuEnv.deployAndSetupContracts(ClaimFormat.DEFAULT);
  }
  {
    ethereumEnv = await EthereumTestEnvironment.setupTestEnvironment(
      erc20TokenContract,
      logLevel,
    );
    log.info("Ethereum Ledger started successfully");

    await ethereumEnv.deployAndSetupContracts(ClaimFormat.DEFAULT);
  }
});

describe("SATPGateway sending a token from Besu to Fabric", () => {
  it("should mint 100 tokens to the owner account", async () => {
    await besuEnv.mintTokens("100");
    await besuEnv.checkBalance(
      besuEnv.getTestContractName(),
      besuEnv.getTestContractAddress(),
      besuEnv.getTestContractAbi(),
      besuEnv.getTestOwnerAccount(),
      "100",
      besuEnv.getTestOwnerSigningCredential(),
    );
  });
  it("should realize a transfer", async () => {
    const address: Address = `http://localhost`;

    // gateway setup:
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
      address,
      gatewayClientPort: DEFAULT_PORT_GATEWAY_CLIENT,
      gatewayServerPort: DEFAULT_PORT_GATEWAY_SERVER,
      gatewayOapiPort: DEFAULT_PORT_GATEWAY_OAPI,
    } as GatewayIdentity;

    // besuConfig Json object setup:
    const besuConfigJSON = await besuEnv.createBesuConfig();

    // fabricConfig Json object setup:
    const fabricConfigJSON = await fabricEnv.createFabricConfig();

    const files = setupGatewayDockerFiles(
      gatewayIdentity,
      logLevel,
      [], //only knows itself
      false, // Crash recovery disabled
      { bridgeConfig: [besuConfigJSON, fabricConfigJSON] },
      {
        client: db_local_config.client,
        connection: db_local_config.connection,
      } as Knex.Config,
      {
        client: db_remote_config.client,
        connection: db_remote_config.connection,
      } as Knex.Config,
    );

    // gatewayRunner setup:
    const gatewayRunnerOptions: ISATPGatewayRunnerConstructorOptions = {
      containerImageVersion: "36e3c0c74-2025-04-01",
      containerImageName: "kubaya/cacti-satp-hermes-gateway",
      logLevel,
      emitContainerLogs: true,
      configFilePath: files.configFilePath,
      logsPath: files.logsPath,
      databasePath: files.databasePath,
      ontologiesPath: files.ontologiesPath,
    };

    gatewayRunner = new SATPGatewayRunner(gatewayRunnerOptions);
    console.log("starting gatewayRunner...");
    await gatewayRunner.start();
    console.log("gatewayRunner started sucessfully");

    const port = await gatewayRunner.getHostPort(4010);

    const approveAddressApi = new GetApproveAddressApi(
      new Configuration({ basePath: `${address}:${port}` }),
    );

    const reqApproveBesuAddress = await approveAddressApi.getApproveAddress({
      networkId: besuEnv.network,
      tokenType: TokenType.NonstandardFungible,
    } as GetApproveAddressRequest);

    if (!reqApproveBesuAddress?.data.approveAddress) {
      throw new Error("Approve address is undefined");
    }

    expect(reqApproveBesuAddress?.data.approveAddress).toBeDefined();

    await besuEnv.giveRoleToBridge(reqApproveBesuAddress?.data.approveAddress);

    if (reqApproveBesuAddress?.data.approveAddress) {
      await besuEnv.approveAmount(
        reqApproveBesuAddress.data.approveAddress,
        "100",
      );
    } else {
      throw new Error("Approve address is undefined");
    }
    log.debug("Approved 100 amout to the Besu Bridge Address");

    const reqApproveFabricAddress = await approveAddressApi.getApproveAddress({
      networkId: fabricEnv.network,
      tokenType: TokenType.NonstandardFungible,
    } as GetApproveAddressRequest);
    expect(reqApproveFabricAddress?.data.approveAddress).toBeDefined();

    if (!reqApproveFabricAddress?.data.approveAddress) {
      throw new Error("Approve address is undefined");
    }

    await fabricEnv.giveRoleToBridge("Org2MSP");

    const satpApi = new TransactionApi(
      new Configuration({ basePath: `${address}:${port}` }),
    );

    const req = getTransactRequest(
      "mockContext",
      besuEnv,
      fabricEnv,
      "100",
      "100",
    );

    const res = await satpApi.transact(req);
    log.info(res?.status);
    log.info(res.data.statusResponse);
    expect(res?.status).toBe(200);

    await besuEnv.checkBalance(
      besuEnv.getTestContractName(),
      besuEnv.getTestContractAddress(),
      besuEnv.getTestContractAbi(),
      besuEnv.getTestOwnerAccount(),
      "0",
      besuEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly from the Owner account");

    await besuEnv.checkBalance(
      besuEnv.getTestContractName(),
      besuEnv.getTestContractAddress(),
      besuEnv.getTestContractAbi(),
      reqApproveBesuAddress?.data.approveAddress,
      "0",
      besuEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly to the Wrapper account");

    await fabricEnv.checkBalance(
      fabricEnv.getTestContractName(),
      fabricEnv.getTestChannelName(),
      reqApproveFabricAddress?.data.approveAddress,
      "0",
      fabricEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly from the Bridge account");

    await fabricEnv.checkBalance(
      fabricEnv.getTestContractName(),
      fabricEnv.getTestChannelName(),
      fabricEnv.getTestOwnerAccount(),
      "100",
      fabricEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly to the Owner account");
  });
});

describe("SATPGateway sending a token from Ethereum to Fabric", () => {
  it("should realize a transfer", async () => {
    const address: Address = `http://localhost`;

    // gateway setup:
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
      connectedDLTs: [
        {
          id: EthereumTestEnvironment.ETH_NETWORK_ID,
          ledgerType: LedgerType.Ethereum,
        },
        {
          id: FabricTestEnvironment.FABRIC_NETWORK_ID,
          ledgerType: LedgerType.Fabric2,
        },
      ],
      proofID: "mockProofID10",
      address,
      gatewayClientPort: DEFAULT_PORT_GATEWAY_CLIENT,
      gatewayServerPort: DEFAULT_PORT_GATEWAY_SERVER,
    } as GatewayIdentity;

    // ethereumConfig Json object setup:
    const ethereumConfigJSON = await ethereumEnv.createEthereumConfig();

    // fabricConfig Json object setup:
    const fabricConfigJSON = await fabricEnv.createFabricConfig();

    // gateway configuration setup:
    const files = setupGatewayDockerFiles(
      gatewayIdentity,
      logLevel,
      [], //only knows itself
      false, // Crash recovery disabled
      { bridgeConfig: [ethereumConfigJSON, fabricConfigJSON] },
      db_local_config,
      db_remote_config,
    );

    let initialBalance;
    try {
      initialBalance = await fabricEnv.apiClient.runTransactionV1({
        contractName: fabricEnv.satpContractName,
        channelName: fabricEnv.fabricChannelName,
        params: [fabricEnv.clientId],
        methodName: "ClientIDAccountBalance",
        invocationType: FabricContractInvocationType.Send,
        signingCredential: fabricEnv.fabricSigningCredential,
      });
    } catch (error) {
      initialBalance = { data: { functionOutput: "0" } };
    }

    //TODO: when ready, change to official hyperledger image
    // -- for now use your local image (the name might be different)
    // gatewayRunner setup:
    const gatewayRunnerOptions: ISATPGatewayRunnerConstructorOptions = {
      containerImageVersion: "latest",
      containerImageName: "ghcr.io/hyperledger/cacti-satp-hermes-gateway",
      logLevel,
      emitContainerLogs: true,
      configFilePath: files.configFilePath,
      logsPath: files.logsPath,
      databasePath: files.databasePath,
      ontologiesPath: files.ontologiesPath,
    };
    const gatewayRunner = new SATPGatewayRunner(gatewayRunnerOptions);
    console.log("starting gatewayRunner...");
    await gatewayRunner.start(true);
    console.log("gatewayRunner started sucessfully");

    const req = getTransactRequest(
      "mockContext",
      ethereumEnv,
      fabricEnv,
      "100",
      "1",
    );

    const port = await gatewayRunner.getHostPort(4010);

    const transactionApiClient = createClient(
      "TransactionApi",
      address,
      port,
      log,
    );
    const adminApi = createClient("AdminApi", address, port, log);

    const res = await transactionApiClient.transact(req);
    log.info(res?.data.statusResponse);

    const sessions = await adminApi.getSessionIds({});
    expect(sessions.data).toBeTruthy();
    expect(sessions.data.length).toBe(1);
    expect(sessions.data[0]).toBe(res.data.sessionID);

    const responseBalanceOwner = await ethereumEnv.connector.invokeContract({
      contract: {
        contractName: ethereumEnv.erc20TokenContract,
        keychainId: ethereumEnv.keychainPlugin1.getKeychainId(),
      },
      invocationType: EthContractInvocationType.Call,
      methodName: "checkBalance",
      params: [WHALE_ACCOUNT_ADDRESS],
      web3SigningCredential: {
        ethAccount: WHALE_ACCOUNT_ADDRESS,
        secret: "",
        type: Web3SigningCredentialType.GethKeychainPassword,
      },
    });
    expect(responseBalanceOwner).toBeTruthy();
    expect(responseBalanceOwner.success).toBeTruthy();
    expect(responseBalanceOwner.callOutput).toBe(BigInt(0));
    log.info("Amount was transfer correctly from the Owner account");

    const responseBalanceBridge = await ethereumEnv.connector.invokeContract({
      contract: {
        contractName: ethereumEnv.erc20TokenContract,
        keychainId: ethereumEnv.keychainPlugin1.getKeychainId(),
      },
      invocationType: EthContractInvocationType.Call,
      methodName: "checkBalance",
      params: [ethereumEnv.wrapperContractAddress],
      web3SigningCredential: {
        ethAccount: WHALE_ACCOUNT_ADDRESS,
        secret: "",
        type: Web3SigningCredentialType.GethKeychainPassword,
      },
    });
    expect(responseBalanceBridge).toBeTruthy();
    expect(responseBalanceBridge.success).toBeTruthy();
    expect(responseBalanceBridge.callOutput).toBe(BigInt(0));
    log.info("Amount was transfer correctly to the Wrapper account");

    const responseBalance1 = await fabricEnv.apiClient.runTransactionV1({
      contractName: fabricEnv.satpContractName,
      channelName: fabricEnv.fabricChannelName,
      params: ["fabricEnv.bridge_id"],
      methodName: "ClientIDAccountBalance",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: fabricEnv.fabricSigningCredential,
    });

    expect(responseBalance1).not.toBeUndefined();
    expect(responseBalance1.status).toBeGreaterThan(199);
    expect(responseBalance1.status).toBeLessThan(300);
    expect(responseBalance1.data).not.toBeUndefined();
    expect(responseBalance1.data.functionOutput).toBe("0");
    log.info("Amount was transfer correctly from the Bridge account");

    const responseBalance2 = await fabricEnv.apiClient.runTransactionV1({
      contractName: fabricEnv.satpContractName,
      channelName: fabricEnv.fabricChannelName,
      params: [fabricEnv.clientId],
      methodName: "ClientIDAccountBalance",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: fabricEnv.fabricSigningCredential,
    });
    expect(responseBalance2).not.toBeUndefined();
    expect(responseBalance2.status).toBeGreaterThan(199);
    expect(responseBalance2.status).toBeLessThan(300);
    expect(responseBalance2.data).not.toBeUndefined();
    expect(responseBalance2.data.functionOutput).toBe(
      (Number(initialBalance.data.functionOutput) + 1).toString(),
    );
    log.info("Amount was transfer correctly to the Owner account");

    await gatewayRunner.stop();
    await gatewayRunner.destroy();
    await db_local.stop();
    await db_local.remove();
    await db_remote.stop();
    await db_remote.remove();
  });
});
