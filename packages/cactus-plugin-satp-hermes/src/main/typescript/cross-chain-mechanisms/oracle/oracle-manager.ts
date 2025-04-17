import {
  type ILoggerOptions,
  type Logger,
  LoggerProvider,
  type LogLevelDesc,
} from "@hyperledger/cactus-common";
import { OracleNotificationDispatcher } from "./oracle-notification-dispatcher";
import { OracleRelayer } from "./oracle-relayer";

import {
  IOracleManagerOptions,
  IOracleRepeatableTask,
  IOracleTask,
  OracleTaskStatusEnum,
} from "./oracle-types";
// import { IPluginBungeeHermesOptions } from "@hyperledger/cactus-plugin-bungee-hermes";
// import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
// import { FabricSigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
// import { OracleEVM } from "./leafs/oracle-evm";
// import { OracleFabric } from "./leafs/oracle-fabric";

export class OracleManager {
  public static readonly CLASS_NAME = "OracleManager";
  private readonly logger: Logger;
  private readonly instanceId: string;

  // Map to store the status for a given task id.
  private taskStatusMap: Map<string, IOracleTask> = new Map();

  private readonly notificationDispatcher: OracleNotificationDispatcher;
  private readonly relayer: OracleRelayer;

  constructor(public readonly options: IOracleManagerOptions) {
    const fnTag = `${OracleManager.CLASS_NAME}#constructor()`;
    if (!options) {
      throw new Error(`${fnTag}: OracleManager options are required`);
    }
    this.instanceId = options.instanceId;
    const level = (options.logLevel || "INFO") as LogLevelDesc;
    const loggerOptions: ILoggerOptions = {
      level,
      label: OracleManager.CLASS_NAME,
    };
    this.logger = LoggerProvider.getOrCreate(loggerOptions);
    this.logger.info(
      `${fnTag}: Initializing OracleManager with instanceId ${this.instanceId}`,
    );

    this.notificationDispatcher = new OracleNotificationDispatcher({
      logger: this.logger,
    });

    // const oracleFabric = new OracleFabric(
    //   {
    //     contractName: "fabricContract",
    //     channelName: "mychannel",
    //     keychainId: "fabricKeychain",
    //     signingCredential: {} as FabricSigningCredential, // todo fix
    //     network: {
    //       id: "fabric-network-id",
    //       ledgerType: "fabric",
    //     },
    //     options: {}, // Provide valid connector options
    //     bungeeOptions: {} as IPluginBungeeHermesOptions, // todo fix
    //   },
    //   this.fabricConnectorConfig,
    //   // bungee: this.bungee,
    // );

    // const oracleEVM = new OracleEVM(
    //   {
    //     contractName: "evmContract",
    //     keychainId: "evmKeychain",
    //     signingCredential: {} as Web3SigningCredential, // todo fix
    //     gas: 3000000,
    //     network: {
    //       id: "evm-network-id",
    //       ledgerType: "evm",
    //     },
    //     options: {}, // Provide valid connector options
    //     bungeeOptions: {} as IPluginBungeeHermesOptions, // todo fix
    //   },
    //   this.ethereumConnectorConfig,
    //   // bungee: this.bungee,
    // );

    this.relayer = new OracleRelayer({
      logger: this.logger,
      oracleFabric: undefined,
      oracleEVM: undefined,
    });
  }

  public getTasks(): IOracleTask[] {
    return Array.from(this.taskStatusMap.values());
  }

  public async registerTask(task: IOracleRepeatableTask): Promise<boolean> {
    const fnTag = `${OracleManager.CLASS_NAME}#registerTask()`;
    this.logger.info(`${fnTag}: Registering task`);

    try {
      this.taskStatusMap.set(task.id, task);
      this.logger.info(`${fnTag}: Task registered successfully`);
      return true;
    } catch (error) {
      this.logger.error(`${fnTag}: Error registering task: ${error}`);
      return false;
    }
  }

  // Executes the task by its id.
  // Note: Execution now calls OracleRelayer.relayTask, passing in the bungee instance.
  public async executeTask(task: IOracleTask): Promise<IOracleTask> {
    const fnTag = `${OracleManager.CLASS_NAME}#executeTask()`;
    this.logger.info(`${fnTag}: Executing task with id ${task.id}`);

    this.taskStatusMap.set(task.id, task);

    try {
      // Execute the task via the relayer.
      await this.relayer.processTask(task);
      // Dispatch a success notification.
    } catch (error) {
      // On error, update status to FAILED and update tasks mapping.
      // Dispatch a failure notification.
      throw error;
    }

    return task;
  }

  // Returns the status for a given task id.
  public getTask(taskId: string): IOracleTask {
    const fnTag = `${OracleManager.CLASS_NAME}#getTask()`;
    const task = this.taskStatusMap.get(taskId);

    if (!task) {
      throw new Error(`${fnTag}: Task with id ${taskId} not found`);
    }

    return task;
  }

  public getTaskStatus(taskId: string): OracleTaskStatusEnum {
    const task = this.getTask(taskId);
    return task.status;
  }

  public async shutdown(): Promise<void> {
    const fnTag = `${OracleManager.CLASS_NAME}#shutdown()`;
    this.logger.info(`${fnTag}: Shutting down OracleManager`);
    // todo
  }
}
