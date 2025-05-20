import {
  BesuTestEnvironment,
  FabricTestEnvironment,
  EthereumTestEnvironment,
  createPGDatabase,
  setupDBTable,
} from "./test-utils"; // Adjust import path
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { Container } from "dockerode";
import { Knex } from "knex";
import { ClaimFormat } from "../../main/typescript/generated/proto/cacti/satp/v02/common/message_pb";
import {
  Containers,
  pruneDockerAllIfGithubAction,
} from "@hyperledger/cactus-test-tooling";

const logLevel: LogLevelDesc = "TRACE";
const log = LoggerProvider.getOrCreate({
  level: logLevel,
  label: "GlobalSetup",
});

let besuEnv: BesuTestEnvironment;
let fabricEnv: FabricTestEnvironment;
let ethereumEnv: EthereumTestEnvironment;

const erc20TokenContract = "SATPContract";

let db_local_config: Knex.Config;
let db_remote_config: Knex.Config;
let db_local: Container;
let db_remote: Container;

module.exports = async function globalSetup() {
  log.info("Global Setup Started");

  const testNetwork = "test-network";

  pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });

  // Database Setup
  ({ config: db_local_config, container: db_local } = await createPGDatabase({
    port: 5432,
    network: testNetwork,
    postgresUser: "user123123",
    postgresPassword: "password",
  }));

  ({ config: db_remote_config, container: db_remote } = await createPGDatabase({
    port: 5450,
    network: testNetwork,
    postgresUser: "user123123",
    postgresPassword: "password",
  }));

  console.log("Waiting for db_remote...");
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
  console.log("db_remote wait complete.");

  await setupDBTable(db_remote_config);

  // Ledger Setup (Lazy Initialization)
  besuEnv = await BesuTestEnvironment.setupTestEnvironment({
    contractName: erc20TokenContract, // Or fetch from env/config
    logLevel,
    network: testNetwork,
  });
  await besuEnv.deployAndSetupContracts(ClaimFormat.DEFAULT);
  log.info("Besu Ledger started successfully");

  const satpContractName = "satp-contract";
  fabricEnv = await FabricTestEnvironment.setupTestEnvironment({
    contractName: satpContractName, // Or fetch from env/config
    logLevel,
    network: testNetwork,
    claimFormat: ClaimFormat.DEFAULT,
  });
  await fabricEnv.deployAndSetupContracts();
  log.info("Fabric Ledger started successfully");

  ethereumEnv = await EthereumTestEnvironment.setupTestEnvironment({
    contractName: erc20TokenContract, // Or fetch from env/config
    logLevel,
    network: testNetwork,
  });
  await ethereumEnv.deployAndSetupContracts(ClaimFormat.DEFAULT);
  log.info("Ethereum Ledger started successfully");

  // Make the environments globally available (IMPORTANT)
  (global as any).__BESU_ENV__ = besuEnv;
  (global as any).__FABRIC_ENV__ = fabricEnv;
  (global as any).__ETHEREUM_ENV__ = ethereumEnv;
  (global as any).__DB_LOCAL_CONFIG__ = db_local_config;
  (global as any).__DB_REMOTE_CONFIG__ = db_remote_config;
  (global as any).__DB_LOCAL__ = db_local;
  (global as any).__DB_REMOTE__ = db_remote;
};
