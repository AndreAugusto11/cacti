import "jest-extended";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import {
  pruneDockerAllIfGithubAction,
  Containers,
} from "@hyperledger/cactus-test-tooling";
import { Address, GatewayIdentity } from "../../../main/typescript/core/types";
import {
  BesuTestEnvironment,
  getTransactRequest,
  EthereumTestEnvironment,
  createPGDatabase,
  setupDBTable,
  generateGatewayConfig,
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fs, { readFileSync } from "fs-extra";
import path from "path";

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

afterAll(async () => {
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

  module.exports = {
    target: "node",
    // other configurations
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            crypto: "crypto-browserify",
            path: "path-browserify",
          },
        },
      ],
    ],
  };
});

describe("SATPGateway sending a token from Besu to Ethereum", () => {
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
    const ethereumConfig = await ethereumEnv.createEthereumConfig();

    const ontologiesPath = path.join(__dirname, "../../ontologies");
    const files = generateGatewayConfig(
      gatewayIdentity,
      logLevel,
      [], //only knows itself
      false, // Crash recovery disabled,
      ontologiesPath,
      { bridgeConfig: [besuConfigJSON, ethereumConfig] },
      {
        client: db_local_config.client,
        connection: db_local_config.connection,
      } as Knex.Config,
      {
        client: db_remote_config.client,
        connection: db_remote_config.connection,
      } as Knex.Config,
    );

    jest.spyOn(fs, "existsSync").mockImplementation((filePath: any) => {
      if (
        typeof filePath === "string" &&
        filePath.includes("/opt/cacti/satp-hermes/config/config.json")
      ) {
        return true;
      }
      return false;
    });

    jest.spyOn(fs, "readJson").mockImplementation(async (filePath: any) => {
      if (
        typeof filePath === "string" &&
        filePath.includes("/opt/cacti/satp-hermes/config/config.json")
      ) {
        return files.config;
      }
      throw new Error("File not found");
    });

    const bundlePath = path.resolve(
      __dirname,
      "../../../../dist/bundle/ncc/index.js",
    );
    const bundleCode = readFileSync(bundlePath, "utf8");

    expect(() => {
      eval(bundleCode); // Executes the bundled JavaScript
    }).not.toThrow(); // Ensure it does not throw errors

    const approveAddressApi = new GetApproveAddressApi(
      new Configuration({
        basePath: `${address}:${gatewayIdentity.gatewayOapiPort}`,
      }),
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
      new Configuration({
        basePath: `${address}:${gatewayIdentity.gatewayOapiPort}`,
      }),
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
