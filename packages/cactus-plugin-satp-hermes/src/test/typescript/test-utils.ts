import { Logger, LogLevelDesc } from "@hyperledger/cactus-common";
import {
  AdminApi,
  OracleApi,
  TransactionApi,
} from "../../main/typescript/generated/gateway-client/typescript-axios/api";
import { TransactRequest } from "../../main/typescript";
import { Configuration } from "../../main/typescript/generated/gateway-client/typescript-axios";
import fs from "fs-extra";
import path from "path";
import { expect } from "@jest/globals";
import { GatewayIdentity } from "../../main/typescript/core/types";
import { BesuTestEnvironment } from "./environments/besu-test-environment";
import { EthereumTestEnvironment } from "./environments/ethereum-test-environment";
import { FabricTestEnvironment } from "./environments/fabric-test-environment";
import knex, { Knex } from "knex";
import Docker, { Container, ContainerInfo } from "dockerode";
import { Containers } from "@hyperledger/cactus-test-tooling/src/main/typescript/common/containers";
import { EventEmitter } from "events";
import { ICrossChainMechanismsOptions } from "../../main/typescript/cross-chain-mechanisms/satp-cc-manager";

export { BesuTestEnvironment } from "./environments/besu-test-environment";
export { EthereumTestEnvironment } from "./environments/ethereum-test-environment";
export { FabricTestEnvironment } from "./environments/fabric-test-environment";

// Function overloads for creating different types of API clients
export function createClient(
  type: "AdminApi",
  address: string,
  port: number,
  logger: Logger,
): AdminApi;
export function createClient(
  type: "TransactionApi",
  address: string,
  port: number,
  logger: Logger,
): TransactionApi;
export function createClient(
  type: "OracleApi",
  address: string,
  port: number,
  logger: Logger,
): OracleApi;

// Creates an API client instance for interacting with the gateway
export function createClient(
  type: "AdminApi" | "TransactionApi" | "OracleApi",
  address: string,
  port: number,
  logger: Logger,
): AdminApi | TransactionApi | OracleApi {
  const config = new Configuration({ basePath: `${address}:${port}` });
  logger.debug(config);

  if (type === "AdminApi") {
    return new AdminApi(config);
  } else if (type === "TransactionApi") {
    return new TransactionApi(config);
  } else if (type === "OracleApi") {
    return new OracleApi(config);
  } else {
    throw new Error("Invalid api type");
  }
}

// Sets up the necessary configuration and log files for running a SATP Gateway in Docker
// Creates configuration and related data in memory without saving to files
export function generateGatewayConfig(
  gatewayIdentity: GatewayIdentity,
  logLevel: LogLevelDesc,
  counterPartyGateways: GatewayIdentity[],
  enableCrashRecovery: boolean = false,
  ontologiesPath: string,
  ccConfig?: ICrossChainMechanismsOptions,
  localRepository?: Knex.Config,
  remoteRepository?: Knex.Config,
  gatewayKeyPair?: {
    privateKey: string;
    publicKey: string;
  },
): {
  config: object;
  logs: string;
  database: string;
  ontologies: object;
} {
  const jsonObject = {
    gid: gatewayIdentity,
    logLevel,
    counterPartyGateways,
    localRepository,
    remoteRepository,
    environment: "development",
    ccConfig,
    gatewayKeyPair,
    enableCrashRecovery: enableCrashRecovery,
    ontologyPath: ontologiesPath,
  };

  const logs = "Logs would be generated here.";
  const database = "Database configuration would be here.";
  const ontologies = { message: "Ontologies data would be here." };

  return {
    config: jsonObject,
    logs,
    database,
    ontologies,
  };
}
export function setupGatewayDockerFiles(
  gatewayIdentity: GatewayIdentity,
  logLevel: LogLevelDesc,
  counterPartyGateways: GatewayIdentity[],
  enableCrashRecovery: boolean = false,
  ccConfig?: ICrossChainMechanismsOptions,
  localRepository?: Knex.Config,
  remoteRepository?: Knex.Config,
  gatewayId: string = "gatewayId",
  fileContext?: string,
  gatewayKeyPair?: {
    privateKey: string;
    publicKey: string;
  },
): {
  configFilePath: string;
  logsPath: string;
  ontologiesPath: string;
} {
  const jsonObject = {
    gid: gatewayIdentity,
    logLevel,
    counterPartyGateways,
    localRepository: localRepository
      ? ({
          client: localRepository.client,
          connection: localRepository.connection,
        } as Knex.Config)
      : undefined,
    remoteRepository: remoteRepository
      ? ({
          client: remoteRepository.client,
          connection: remoteRepository.connection,
        } as Knex.Config)
      : undefined,
    environment: "development",
    ccConfig,
    gatewayKeyPair,
    enableCrashRecovery: enableCrashRecovery,
    ontologyPath: "/opt/cacti/satp-hermes/ontologies",
    // databaseMigrationPath: "/opt/cacti/satp-hermes/database/migrations",
  };
  // Create a timestamp for the files if no context provided
  const context =
    fileContext ||
    new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");

  // creates the configuration file for the gateway setup
  const directory = `${__dirname}/../../../cache/`;
  const configDir = path.join(directory, `gateway-info-${gatewayId}/config`);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  const configFilePath = path.join(configDir, `gateway-config-${context}.json`);
  fs.writeFileSync(configFilePath, JSON.stringify(jsonObject, null, 2));
  expect(fs.existsSync(configFilePath)).toBe(true);

  // creates the files for logging the output and error:
  const logDir = path.join(directory, `gateway-info-${gatewayId}/logs`);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const ontologiesDir = path.join(
    directory,
    `gateway-info-${gatewayId}/ontologies`,
  );
  // Ensure the ontologies directory exists
  if (!fs.existsSync(ontologiesDir)) {
    fs.mkdirSync(ontologiesDir, { recursive: true });
  }

  // Copy the ontologies folder to the specified location
  const sourceOntologiesDir = path.join(__dirname, "../ontologies");
  if (fs.existsSync(sourceOntologiesDir)) {
    fs.copySync(sourceOntologiesDir, ontologiesDir);
  } else {
    throw new Error(
      `Source ontologies directory does not exist: ${sourceOntologiesDir}`,
    );
  }

  return {
    configFilePath,
    logsPath: logDir,
    ontologiesPath: ontologiesDir,
  };
}

// Creates a TransactRequest for testing transactions
export function getTransactRequest(
  contextID: string,
  from: BesuTestEnvironment | EthereumTestEnvironment | FabricTestEnvironment,
  to: BesuTestEnvironment | EthereumTestEnvironment | FabricTestEnvironment,
  fromAmount: string,
  toAmount: string,
): TransactRequest {
  return {
    contextID,
    originatorPubkey: from.transactRequestPubKey,
    beneficiaryPubkey: to.transactRequestPubKey,
    sourceAsset: { ...from.defaultAsset, amount: fromAmount },
    receiverAsset: { ...to.defaultAsset, amount: toAmount },
  };
}

export async function createPGDatabase(
  port: number,
  toUseInDocker: boolean = false,
  network?: string,
  postgresUser: string = "postgres", // You can set default values or accept them as parameters
  postgresPassword: string = "password",
  postgresDB: string = "my_database",
): Promise<{ config: Knex.Config; container: Container }> {
  const fnTag = "createPGDatabase()";
  const docker = new Docker();

  const imageFqn = "postgres:17.2";

  console.debug(`Pulling container image ${imageFqn} ...`);
  await Containers.pullImage(imageFqn, {}, "DEBUG");
  console.debug(`Pulled ${imageFqn} OK. Starting container...`);

  console.debug(`Starting container with image: ${imageFqn}...`);

  if (network) {
    const networks = await docker.listNetworks();
    const networkExists = networks.some((n) => n.Name === network);
    if (!networkExists) {
      await docker.createNetwork({
        Name: network,
        Driver: "bridge",
      });
    }
  }

  // Define your host configuration
  const hostConfig: Docker.HostConfig = {
    PublishAllPorts: true,
    Binds: [],
    PortBindings: {
      "5432/tcp": [{ HostPort: `${port}` }],
    },
    NetworkMode: network,
  };

  // Define your health check
  const healthCheck = {
    test: [
      "CMD-SHELL",
      `sh -c 'pg_isready -h localhost -d ${postgresDB} -U ${postgresUser} -p 5432'`,
    ],
    interval: 1000000, // 1 second (in nanoseconds)
    timeout: 60000000, // 3 seconds timeout
    retries: 30, // Retry 3 times
    startPeriod: 1000000, // 1 second (in nanoseconds)
  };

  // Running the Docker container with health check
  const container = new Promise<Container>((resolve, reject) => {
    const eventEmitter: EventEmitter = docker.run(
      imageFqn,
      [],
      [],
      {
        ExposedPorts: {
          ["5432/tcp"]: {},
        },
        HostConfig: hostConfig,
        Healthcheck: healthCheck,
        Env: [
          `POSTGRES_USER=${postgresUser}`, // Set the database user
          `POSTGRES_PASSWORD=${postgresPassword}`, // Set the database password
          `POSTGRES_DB=${postgresDB}`, // Optionally set the database name (can be the same as the user)
        ],
      },
      {},
      (err: unknown) => {
        if (err) {
          reject(err);
        }
      },
    );

    eventEmitter.once("start", async (container: Container) => {
      console.debug(`Started container OK. Waiting for healthcheck...`);

      try {
        const startedAt = Date.now();
        let isHealthy = false;
        do {
          if (Date.now() >= startedAt + 60000) {
            throw new Error(`${fnTag} timed out (${60000}ms)`);
          }

          const containerInfos = await docker.listContainers({});

          const containerInfo = containerInfos.find(
            (ci) => ci.Id === container.id,
          );
          let status;
          try {
            status = ((await containerInfo) as ContainerInfo).Status;
          } catch {
            continue;
          }

          isHealthy = status.endsWith("(healthy)");
          if (!isHealthy) {
            await new Promise((resolve2) => setTimeout(resolve2, 1000));
          }
        } while (!isHealthy);
        console.debug(`Healthcheck passing OK.`);
        resolve(container);
      } catch (ex) {
        reject(ex);
      }
    });
  });

  const containerData = await docker
    .getContainer((await container).id)
    .inspect();

  if (toUseInDocker) {
    return {
      config: {
        client: "pg", // Specify PostgreSQL as the client
        connection: {
          host: containerData.NetworkSettings.Networks[network || "bridge"]
            .IPAddress, // Use the container's IP address
          user: postgresUser, // Database user
          password: postgresPassword, // Database password
          database: postgresDB, // The name of your PostgreSQL database
          port: 5432, // Default PostgreSQL port
          ssl: false, // Set to true if you're using SSL for a secure connection
        },
        migrations: {
          directory:
            "./packages/cactus-plugin-satp-hermes/src/main/typescript/database/migrations",
        },
      } as Knex.Config,
      container: await container,
    };
  }
  return {
    config: {
      client: "pg", // Specify PostgreSQL as the client
      connection: {
        host: "localhost", // Use localhost for local development
        user: postgresUser, // Database user
        password: postgresPassword, // Database password
        database: postgresDB, // The name of your PostgreSQL database
        port: port, // Default PostgreSQL port
        ssl: false, // Set to true if you're using SSL for a secure connection
      },
      migrations: {
        directory:
          "./packages/cactus-plugin-satp-hermes/src/main/typescript/database/migrations",
      },
    } as Knex.Config,
    container: await container,
  };
}

export async function setupDBTable(config: Knex.Config): Promise<void> {
  const knexInstanceClient = knex(config);
  await knexInstanceClient.migrate.latest();
}

export interface IContractJson {
  abi: any;
  bytecode: {
    object: string;
  };
}
