// todo implement service by calling internal compomnents (public functions of oracle manager)
/*
GOAL
Goal is to implement an oracle that allows data transfers, keeping accountability. gateway notarizes data (produces a proof with bungee) and persists the data on target + notarization

IDEA:
Register data transfer task (automatic data transfer, needs trigger conditions)ORexecute data transfer task (perform one data transfer at current time)

General Config includes:
1. Source and target chain id
2. Source and target chain contract id
3. Source chain contract event name or function endpoint
4. if event name, then also event fields 5. if function endponit, which method and parameters
6. session id (for data transfer)
7. (optional) callbackurl for notifications

config for automatic data transfer
8. trigger conditions (eg fire event, return value on certain function call changes, time, 


returns an ID (of data transfer task, taskID) to be used in the status endpoint;
*/

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { OracleManager } from "../../cross-chain-mechanisms/oracle/oracle-manager";
import {
  OracleRegisterRequest,
  OracleRegisterResponse,
} from "../../public-api";
import {
  IOracleRepeatableTask,
  OracleTaskStatusEnum,
  OracleTaskType,
} from "../../cross-chain-mechanisms/oracle/oracle-types";
import { convertToDomainOracleRepeatableTaskMode } from "../../cross-chain-mechanisms/oracle/oracle-utils";
import { v4 as uuidv4 } from "uuid";

export async function registerTask(
  logLevel: LogLevelDesc,
  req: OracleRegisterRequest,
  manager: OracleManager,
): Promise<OracleRegisterResponse> {
  const fnTag = `registerTask()`;
  const logger = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  logger.info(`${fnTag}, executing task registration endpoint`);

  let type: OracleTaskType;

  // we need to create a IOracleTask based on the parameters of the request and based on the type of task and mode of task
  switch (req.taskType) {
    case "READ": {
      if (
        !req.sourceNetwork ||
        !req.sourceContract ||
        (!req.sourceFunctionName && !req.eventSignature)
      ) {
        throw new Error(
          `${fnTag}, Invalid READ task request: sourceNetwork, sourceContract, and either readFunction or eventSignature must be defined.`,
        );
      }

      if (!req.sourceFunctionName && !req.sourceFunctionParams) {
        throw new Error(
          `${fnTag}, Invalid READ task request: sourceFunctionParams must be defined when sourceFunctionName is defined.`,
        );
      }

      if (req.taskMode === "POLLING" && !req.taskInterval) {
        throw new Error(
          `${fnTag}, Invalid READ task request: taskInterval must be defined for POLLING mode.`,
        );
      }
      type = OracleTaskType.READ;
      break;
    }
    case "UPDATE": {
      if (
        !req.targetNetwork ||
        !req.destinationContract ||
        !req.destinationFunctionName
      ) {
        throw new Error(
          `${fnTag}, Invalid UPDATE task request: targetNetwork, destinationContract, and writeFunction must be defined.`,
        );
      }

      if (!req.destinationFunctionName && !req.destinationFunctionParams) {
        throw new Error(
          `${fnTag}, Invalid UPDATE task request: destinationFunctionParams must be defined when destinationFunctionName is defined.`,
        );
      }

      if (req.taskMode === "POLLING" && !req.taskInterval) {
        throw new Error(
          `${fnTag}, Invalid UPDATE task request: taskInterval must be defined for POLLING mode.`,
        );
      }

      type = OracleTaskType.UPDATE;
      break;
    }
    case "READ_AND_UPDATE": {
      if (
        !req.sourceNetwork ||
        !req.sourceContract ||
        !req.sourceFunctionName ||
        !req.targetNetwork ||
        !req.destinationContract ||
        !req.destinationFunctionName
      ) {
        throw new Error(
          `${fnTag}, Invalid READ_AND_UPDATE task request: sourceNetwork, sourceContract, readFunction, targetNetwork, destinationContract, and writeFunction must be defined.`,
        );
      }

      if (!req.sourceFunctionName && !req.sourceFunctionParams) {
        throw new Error(
          `${fnTag}, Invalid READ task request: sourceFunctionParams must be defined when sourceFunctionName is defined.`,
        );
      }

      if (req.taskMode === "POLLING" && !req.taskInterval) {
        throw new Error(
          `${fnTag}, Invalid READ_AND_UPDATE task request: taskInterval must be defined for POLLING mode.`,
        );
      }

      type = OracleTaskType.READ_AND_UPDATE;
      break;
    }
    default: {
      throw new Error(`${fnTag}, Unsupported task type: ${req.taskType}`);
    }
  }

  // Create the task object
  const task = {
    id: uuidv4(),
    type: type,
    outputs: [],
    srcNetworkId: req.sourceNetwork,
    srcContractAddress: req.sourceContract,
    srcFunctionName: req.sourceFunctionName,
    srcFunctionParams: req.sourceFunctionParams,
    dstNetworkId: req.targetNetwork,
    dstContractAddress: req.destinationContract,
    dstFunctionName: req.destinationFunctionName,
    dstFunctionParams: req.destinationFunctionParams,
    mode: convertToDomainOracleRepeatableTaskMode(req.taskMode),
    status: OracleTaskStatusEnum.ACTIVE,
    timestamp: Date.now(),
    taskInterval: req.taskMode === "POLLING" ? req.taskInterval : undefined,
    operations: [],
  } as IOracleRepeatableTask;

  const success = await manager.registerTask(task);

  return {
    taskID: task.id,
    status: success ? "SUCCESS" : "FAILURE",
  } as OracleRegisterResponse;
}
