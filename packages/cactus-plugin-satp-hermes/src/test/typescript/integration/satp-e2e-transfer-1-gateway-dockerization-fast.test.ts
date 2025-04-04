import "jest-extended";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import {
  pruneDockerAllIfGithubAction,
  Containers,
  SATPGatewayRunner,
  ISATPGatewayRunnerConstructorOptions,
} from "@hyperledger/cactus-test-tooling";
import { Address, GatewayIdentity } from "../../../main/typescript/core/types";
import {
  setupGatewayDockerFiles,
  BesuTestEnvironment,
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
import { Container } from "dockerode";
import { Knex } from "knex";
import { Configuration } from "@hyperledger/cactus-core-api";
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
    const besuConfig = await besuEnv.createBesuConfig();

    // fabricConfig Json object setup:
    const ethereumConfig = await ethereumEnv.createEthereumConfig();

    const files = setupGatewayDockerFiles(
      gatewayIdentity,
      logLevel,
      [], //only knows itself
      false, // Crash recovery disabled
      { bridgeConfig: [besuConfig, ethereumConfig] },
      db_local_config,
      db_remote_config,
    );

    // gatewayRunner setup:
    const gatewayRunnerOptions: ISATPGatewayRunnerConstructorOptions = {
      containerImageVersion: "b11f0957e-2025-04-04",
      containerImageName: "kubaya/cacti-satp-hermes-gateway",
      logLevel,
      emitContainerLogs: true,
      configFilePath: files.configFilePath,
      logsPath: files.logsPath,
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

    const reqApproveEthereumAddress = await approveAddressApi.getApproveAddress(
      {
        networkId: ethereumEnv.network,
        tokenType: TokenType.NonstandardFungible,
      } as GetApproveAddressRequest,
    );

    expect(reqApproveEthereumAddress?.data.approveAddress).toBeDefined();

    if (!reqApproveEthereumAddress?.data.approveAddress) {
      throw new Error("Approve address is undefined");
    }

    await ethereumEnv.giveRoleToBridge(
      reqApproveEthereumAddress.data.approveAddress,
    );

    const satpApi = new TransactionApi(
      new Configuration({ basePath: `${address}:${port}` }),
    );

    const req = getTransactRequest(
      "mockContext",
      besuEnv,
      ethereumEnv,
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
      besuEnv.getTestOwnerAccount(),
      "0",
      besuEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly to the Wrapper account");

    await ethereumEnv.checkBalance(
      ethereumEnv.getTestContractName(),
      ethereumEnv.getTestContractAddress(),
      ethereumEnv.getTestContractAbi(),
      reqApproveEthereumAddress?.data.approveAddress,
      "0",
      ethereumEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly from the Bridge account");

    await ethereumEnv.checkBalance(
      ethereumEnv.getTestContractName(),
      ethereumEnv.getTestContractAddress(),
      ethereumEnv.getTestContractAbi(),
      ethereumEnv.getTestOwnerAccount(),
      "100",
      ethereumEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly to the Owner account");
  });
});
