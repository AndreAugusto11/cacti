import {
  LoggerProvider,
  type Logger,
  type LogLevelDesc,
} from "@hyperledger/cactus-common";
import type {
  OracleFabric,
  ReadEntryArgs as FabricReadArgs,
} from "./leafs/oracle-fabric";
import type {
  OracleEVM,
  ReadEntryArgs as EVMReadArgs,
} from "./leafs/oracle-evm";
import type { IOracleTask, IOracleResponse } from "./oracle-types";

import {
  IOracleOperation,
  IOracleOperationType,
  OracleOperationStatusEnum,
  OracleTaskType,
} from "./oracle-types";
import { ReadEntryArgsBase } from "./leafs/oracle-abstract";
import { v4 as uuidv4 } from "uuid";
import { updateOracleOperation } from "./oracle-utils";

export interface IOracleListener {
  taskId: string;
  chain: "fabric" | "evm";
  oracleEVM: OracleEVM;
  oracleFabric: OracleFabric;
  readArgs: EVMReadArgs | FabricReadArgs;
  taskType: OracleTaskType;
}

export type OracleTaskTriggerCondition = {
  type: string;
  scheduleTime?: Date;
};

export type ScheduledOracleTask = IOracleTask & {
  triggerCondition?: OracleTaskTriggerCondition;
};

export interface OracleRelayerOptions {
  logger: Logger;
  oracleFabric?: OracleFabric;
  oracleEVM?: OracleEVM;
}

export class OracleRelayer {
  public static readonly CLASS_NAME = "OracleRelayer";
  public readonly log: Logger;
  private fabric?: OracleFabric;
  private evm?: OracleEVM;
  // Scheduler fields.
  // private scheduledTasks: ScheduledOracleTask[] = [];
  // private listeners: IOracleListener[] = [];
  // private pollerId: NodeJS.Timer | undefined;

  constructor(options: OracleRelayerOptions, level?: LogLevelDesc) {
    const label = OracleRelayer.CLASS_NAME;
    level = level || "INFO";
    this.log = options.logger ?? LoggerProvider.getOrCreate({ label, level });
    this.fabric = options.oracleFabric ? options.oracleFabric : undefined;
    this.evm = options.oracleEVM ? options.oracleEVM : undefined;
    this.log.debug(`${label}#constructor: OracleRelayer initialized.`);
  }

  get fabricOracle(): OracleFabric {
    if (!this.fabric) {
      throw new Error("Fabric oracle not initialized");
    }
    return this.fabric;
  }

  get evmOracle(): OracleEVM {
    if (!this.evm) {
      throw new Error("EVM oracle not initialized");
    }
    return this.evm;
  }

  public async processTask(task: IOracleTask): Promise<void> {
    const fnTag = `${OracleRelayer.CLASS_NAME}#relayTask`;
    this.log.debug(`${fnTag}: Processing task ${task.id}`);

    // here, we decompose a task into multiple operations as needed and then call
    // relayOperation for each operation. A READ or UPDATE task are decomposed into
    // only one operation, but a READ_AND_UPDATE task is decomposed into two operations,
    // one READ and one UPDATE with the data read from the first operation.

    const operations: IOracleOperation[] = [];

    if (task.type === OracleTaskType.READ) {
      const operation = {
        id: uuidv4(),
        type: IOracleOperationType.READ,
        networkId: task.srcNetworkId,
        contractAddress: task.srcContractAddress,
        functionName: task.srcFunctionName,
        functionParams: task.srcFunctionParams,
        status: OracleOperationStatusEnum.PENDING,
        output: task,
        timestamp: Date.now(),
      } as IOracleOperation;

      await this.relayOperation(operation);
      operations.push(operation);
    } else if (task.type === OracleTaskType.UPDATE) {
      const operation = {
        id: uuidv4(),
        type: IOracleOperationType.UPDATE,
        networkId: task.dstNetworkId,
        contractAddress: task.dstContractAddress,
        functionName: task.dstFunctionName,
        functionParams: task.dstFunctionParams,
        status: OracleOperationStatusEnum.PENDING,
        output: task,
        timestamp: Date.now(),
      } as IOracleOperation;

      await this.relayOperation(operation);
      operations.push(operation);
    } else if (task.type === OracleTaskType.READ_AND_UPDATE) {
      const readOperation = {
        id: uuidv4(),
        type: IOracleOperationType.READ,
        networkId: task.srcNetworkId,
        contractAddress: task.srcContractAddress,
        functionName: task.srcFunctionName,
        functionParams: task.srcFunctionParams,
        status: OracleOperationStatusEnum.PENDING,
        output: task,
        timestamp: Date.now(),
      } as IOracleOperation;

      await this.relayOperation(readOperation);
      operations.push(readOperation);

      const updateOperation = {
        id: uuidv4(),
        type: IOracleOperationType.UPDATE,
        networkId: task.dstNetworkId,
        contractAddress: task.dstContractAddress,
        functionName: task.dstFunctionName,
        functionParams: [readOperation.output?.output],
        status: OracleOperationStatusEnum.PENDING,
        output: task,
        timestamp: Date.now(),
      } as IOracleOperation;

      await this.relayOperation(updateOperation);
      operations.push(updateOperation);
    }

    task.operations = operations;
    task.timestamp = Date.now();
    this.log.debug(
      `${fnTag}: Task ${task.id} processed with operations: ${JSON.stringify(
        operations,
      )}`,
    );
  }

  /**
   * Immediately dispatches an operation to the appropriate oracle.
   */
  public async relayOperation(
    operation: IOracleOperation,
  ): Promise<IOracleResponse> {
    const fnTag = `${OracleRelayer.CLASS_NAME}#relayTask`;
    this.log.debug(
      `${fnTag}: Relaying operation ${operation.id} to network ${operation.networkId}`,
    );

    if (operation.type === IOracleOperationType.READ) {
      const readArgs = {
        chainId: operation.networkId,
        contractId: operation.contractAddress,
        methodName: operation.functionName,
        params: operation.functionParams,
      } as ReadEntryArgsBase;

      this.log.debug(`${fnTag}: Executing read operation ${operation.id}`);

      if (operation.networkId.toLowerCase().includes("fabric")) {
        const result = await this.fabricOracle.readEntry(
          readArgs as FabricReadArgs,
        );
        this.log.debug(
          `${fnTag}: Fabric read result for operation ${operation.id}`,
          result,
        );
        updateOracleOperation(operation, OracleOperationStatusEnum.SUCCESS, {
          output: result,
        });
        return {
          transactionId: "",
          transactionReceipt: "Read operation completed successfully",
          output: result,
        };
      } else if (operation.networkId.toLowerCase().includes("ethereum")) {
        const result = await this.evmOracle.readEntry(readArgs as EVMReadArgs);
        this.log.debug(
          `${fnTag}: EVM read result for operation ${operation.id}`,
          result,
        );
        updateOracleOperation(operation, OracleOperationStatusEnum.SUCCESS, {
          output: result,
        });
        return {
          transactionId: "",
          transactionReceipt: "Read operation completed successfully",
          output: result,
        };
      } else {
        this.log.warn(`${fnTag}: Unknown target chain: ${operation.networkId}`);
        updateOracleOperation(operation, OracleOperationStatusEnum.FAILED, {});
        return {
          transactionId: "",
          transactionReceipt: "Read operation failed",
          output: "Unknown target chain",
        };
      }
    } else if (operation.type === IOracleOperationType.UPDATE) {
      try {
        if (operation.networkId.toLowerCase().includes("fabric")) {
          const entry = {
            channelName: "mychannel", // derive from operation details
            header: {
              targetChainId: operation.networkId,
              sequenceNumber: Date.now(),
            },
            payload: JSON.stringify(operation),
          };
          const { transactionResponse } =
            await this.fabricOracle.updateEntry(entry);
          this.log.debug(
            `${fnTag}: Fabric transaction ${transactionResponse.transactionId} completed.`,
          );

          updateOracleOperation(operation, OracleOperationStatusEnum.SUCCESS, {
            output: transactionResponse,
          });
          return {
            transactionId: transactionResponse.transactionId,
            transactionReceipt: "Transaction executed successfully",
            output: transactionResponse,
          };
        } else if (operation.networkId.toLowerCase().includes("ethereum")) {
          const entry = {
            header: {
              targetChainId: operation.networkId,
              sequenceNumber: Date.now(),
            },
            payload: JSON.stringify(operation),
          };
          const { transactionResponse } =
            await this.evmOracle.updateEntry(entry);
          this.log.debug(
            `${fnTag}: EVM transaction ${transactionResponse.transactionId} completed.`,
          );

          updateOracleOperation(operation, OracleOperationStatusEnum.SUCCESS, {
            output: transactionResponse,
          });
          return {
            transactionId: transactionResponse.transactionId,
            transactionReceipt: "Transaction executed successfully",
            output: transactionResponse,
          };
        } else {
          this.log.warn(
            `${fnTag}: Unknown target chain: ${operation.networkId}`,
          );

          updateOracleOperation(
            operation,
            OracleOperationStatusEnum.FAILED,
            {},
          );
          return {
            transactionId: "",
            transactionReceipt: "Transaction failed",
            output: "Unknown target chain",
          };
        }
      } catch (error) {
        this.log.error(`${fnTag}: Failed to relay operation.`, error);
        throw error;
      }
    } else {
      this.log.warn(`${fnTag}: Unknown operation type: ${operation.type}`);
      return {
        transactionId: "",
        transactionReceipt: "Task execution failed",
        output: "Unknown operation type",
      };
    }
  }

  // protected isTriggered(condition?: OracleTaskTriggerCondition): boolean {
  //   if (!condition) return false;
  //   if (condition.scheduleTime && condition.scheduleTime <= new Date())
  //     return true;
  //   return false;
  // }

  // /**
  //  * Starts a polling mechanism that checks all listeners at a regular interval.
  //  */
  // private pollAllTasks(intervalMs: number): void {
  //   const fnTag = `${OracleRelayer.CLASS_NAME}#pollAllTasks`;
  //   this.pollerId = setInterval(async () => {
  //     for (const listener of this.listeners) {
  //       const scheduledTask = this.scheduledTasks.find(
  //         (t) => t.id === listener.taskId,
  //       );
  //       if (!scheduledTask) {
  //         this.log.warn(
  //           `${fnTag}: No scheduled task found for listener ${listener.taskId}`,
  //         );
  //         continue;
  //       }
  //       try {
  //         this.relayOperation(scheduledTask);
  //       } catch (err) {
  //         this.log.error(
  //           `${fnTag}: Error polling task ${listener.taskId}`,
  //           err,
  //         );
  //       }
  //     }
  //   }, intervalMs);
  // }

  // public addListener(
  //   task: IOracleRepeatableTask,
  //   chain: "fabric" | "evm",
  //   oracleEVM: OracleEVM,
  //   oracleFabric: OracleFabric,
  //   intervalMs: number,
  //   readArgs: EVMReadArgs | FabricReadArgs,
  //   triggerCondition?: OracleTaskTriggerCondition,
  // ): void {
  //   const fnTag = `${OracleRelayer.CLASS_NAME}#addListener`;
  //   const scheduledTask: ScheduledOracleTask = { ...task, triggerCondition };
  //   if (!this.scheduledTasks.find((t) => t.id === task.id)) {
  //     this.scheduledTasks.push(scheduledTask);
  //   }
  //   this.listeners.push({
  //     taskId: task.id,
  //     chain,
  //     oracleEVM,
  //     oracleFabric,
  //     readArgs,
  //     taskType: task.type,
  //   });
  //   if (this.listeners.length === 1) {
  //     // Start polling if first listener is added.
  //     this.pollAllTasks(intervalMs);
  //   }
  //   this.log.debug(`${fnTag}: Listener added for task ${task.id}`);
  // }

  // public removeListener(taskId: string): void {
  //   const fnTag = `${OracleRelayer.CLASS_NAME}#removeListener`;
  //   const idx = this.listeners.findIndex((l) => l.taskId === taskId);
  //   if (idx !== -1) {
  //     this.listeners.splice(idx, 1);
  //     this.log.debug(`${fnTag}: Removed listener for task ${taskId}`);
  //     if (this.listeners.length === 0 && this.pollerId) {
  //       clearInterval(this.pollerId);
  //       this.pollerId = undefined;
  //     }
  //   } else {
  //     this.log.debug(`${fnTag}: No active listener for task ${taskId}`);
  //   }
  // }

  // public async shutdown(): Promise<void> {
  //   const fnTag = `${OracleRelayer.CLASS_NAME}#shutdown`;
  //   this.log.debug(`${fnTag}: Shutting down relayer scheduler.`);
  //   if (this.pollerId) {
  //     clearInterval(this.pollerId);
  //     this.pollerId = undefined;
  //   }
  //   this.listeners = [];
  // }
}
