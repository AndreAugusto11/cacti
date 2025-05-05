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
  OracleTask,
  OracleTaskModeEnum,
  OracleTaskStatusEnum,
  OracleTaskTypeEnum,
} from "../../public-api";
import { v4 as uuidv4 } from "uuid";

export async function registerTask(
  logLevel: LogLevelDesc,
  req: OracleRegisterRequest,
  manager: OracleManager,
): Promise<OracleTask> {
  const fnTag = `registerTask()`;
  const logger = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  logger.info(`${fnTag}, executing task registration endpoint`);

  let type: OracleTaskTypeEnum;

  if (req.taskMode === OracleTaskModeEnum.Polling) {
    if (!req.pollingInterval) {
      throw new Error(
        `${fnTag}, Invalid register of READ task with POLLING mode: pollingInterval must be defined for POLLING mode.`,
      );
    }
  }

  switch (req.taskType) {
    case "READ": {
      if (req.destinationContract || req.destinationNetworkId) {
        logger.info(
          `${fnTag} - parameters of destination network will be ignored for a READ task`,
        );
      }

      if (
        !req.sourceNetworkId ||
        !req.sourceContract ||
        !req.sourceContract.contractName
      ) {
        throw new Error(
          `${fnTag} - missing required parameters for executing READ task. Requirements: sourceNetworkId, sourceContract, sourceContract.contractName`,
        );
      }

      if (req.taskMode === OracleTaskModeEnum.Polling) {
        if (!req.sourceContract.methodName || !req.sourceContract.params) {
          throw new Error(
            `${fnTag}, Invalid register of READ task with POLLING mode: methodName and params must be defined for POLLING mode.`,
          );
        }

        if (req.sourceContract.eventSignature) {
          logger.info(
            `${fnTag} - sourceContract.eventSignature will be ignored for POLLING mode`,
          );
        }
      } else if (req.taskMode === OracleTaskModeEnum.EventListening) {
        if (req.sourceContract.methodName || req.sourceContract.params) {
          logger.info(
            `${fnTag} - sourceContract.methodName and sourceContract.params will be ignored for EVENT_LISTENING mode`,
          );
        }

        if (req.pollingInterval) {
          throw new Error(
            `${fnTag}, Invalid register of READ task with EVENT_LISTENING mode: pollingInterval must not be defined for EVENT_LISTENING mode.`,
          );
        }

        if (!req.sourceContract.eventSignature) {
          throw new Error(
            `${fnTag}, Invalid register of READ task with EVENT_LISTENING mode: sourceContract.eventSignature must be defined for EVENT_LISTENING mode.`,
          );
        }
      }

      type = OracleTaskTypeEnum.Read;
      break;
    }
    case "UPDATE": {
      if (req.sourceContract || req.sourceNetworkId) {
        logger.info(
          `${fnTag} - parameters of source network will be ignored for an UPDATE task`,
        );
      }

      if (
        !req.destinationNetworkId ||
        !req.destinationContract ||
        !req.destinationContract?.methodName
      ) {
        throw new Error(
          `${fnTag}, Invalid UPDATE task request: destinationNetworkId, destinationContract, and writeFunction must be defined.`,
        );
      }

      if (
        !req.destinationContract?.methodName &&
        !req.destinationContract.params
      ) {
        throw new Error(
          `${fnTag}, Invalid UPDATE task request: destinationFunctionParams must be defined when destinationContract?.methodName is defined.`,
        );
      }

      if (req.taskMode === OracleTaskModeEnum.Polling) {
        if (
          !req.destinationContract.methodName ||
          !req.destinationContract.params
        ) {
          throw new Error(
            `${fnTag}, Invalid register of UPDATE task with POLLING mode: methodName and params must be defined for POLLING mode.`,
          );
        }
      } else if (req.taskMode === OracleTaskModeEnum.EventListening) {
        if (
          req.destinationContract.methodName ||
          req.destinationContract.params
        ) {
          logger.info(
            `${fnTag} - destinationContract.methodName and destinationContract.params will be ignored for EVENT_LISTENING mode`,
          );
        }

        if (req.pollingInterval) {
          throw new Error(
            `${fnTag}, Invalid register of UPDATE task with EVENT_LISTENING mode: pollingInterval must not be defined for EVENT_LISTENING mode.`,
          );
        }
      }
      type = OracleTaskTypeEnum.Update;
      break;
    }
    case "READ_AND_UPDATE": {
      if (
        !req.sourceNetworkId ||
        !req.sourceContract ||
        !req.destinationNetworkId ||
        !req.destinationContract
      ) {
        throw new Error(
          `${fnTag}, Invalid READ_AND_UPDATE task request: sourceNetworkId, sourceContract, readFunction, destinationNetworkId, destinationContract, and writeFunction must be defined.`,
        );
      }

      if (
        !req.sourceContract.methodName &&
        !req.sourceContract.params &&
        !req.sourceContract.eventSignature
      ) {
        throw new Error(
          `${fnTag}, Invalid READ_AND_UPDATE task request: methodName and params or eventSignature must be defined.`,
        );
      }

      if (req.taskMode === "POLLING" && !req.pollingInterval) {
        throw new Error(
          `${fnTag}, Invalid READ_AND_UPDATE task request: pollingInterval must be defined for POLLING mode.`,
        );
      }

      if (
        req.taskMode === "EVENT_LISTENING" &&
        !req.sourceContract.eventSignature
      ) {
        throw new Error(
          `${fnTag}, Invalid READ_AND_UPDATE task request: sourceContract.eventSignature must be defined for EVENT_LISTENING mode.`,
        );
      }

      type = OracleTaskTypeEnum.ReadAndUpdate;
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
    srcNetworkId: req.sourceNetworkId,
    dstNetworkId: req.destinationNetworkId,
    srcContract: req.sourceContract,
    dstContract: req.destinationContract,
    mode: req.taskMode,
    status: OracleTaskStatusEnum.Active,
    timestamp: Date.now(),
    pollingInterval:
      req.taskMode === "POLLING" ? req.pollingInterval : undefined,
    operations: [],
  } as OracleTask;

  return await manager.registerTask(task);
}
