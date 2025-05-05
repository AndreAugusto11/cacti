// todo implement service by calling internal components (public functions of oracle manager)
/*
GOAL
Goal is to implement an oracle that allows data transfers, keeping accountability. gateway notarizes data (produces a proof with bungee) and persists the data on target + notarization

IDEA:
instead of Register data transfer task,that is ran on specific conditions, do a one-time data transfer task

input parameters include
4. if event name, then also event fields 5. if function endpoint, which method and parameters
6. session id (for data transfer)
7. (optional) callbackurl for notifications
smart contract addresses, functions, and parameters for source and target chains, etc

returns an ID (of data transfer task, taskID) to be used in the status endpoint;
*/

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { OracleManager } from "../../cross-chain-mechanisms/oracle/oracle-manager";
import {
  BusinessLogicContract,
  OracleExecuteRequest,
  OracleTask,
  OracleTaskModeEnum,
  OracleTaskStatusEnum,
  OracleTaskTypeEnum,
} from "../../public-api";

import { v4 as uuidv4 } from "uuid";

export async function executeTask(
  logLevel: LogLevelDesc,
  req: OracleExecuteRequest,
  manager: OracleManager,
): Promise<OracleTask> {
  const fnTag = `executeTask()`;
  const logger = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  logger.info(`${fnTag}, executing task execution endpoint`);

  let taskType;

  switch (req.taskType) {
    case "READ": {
      if (req.destinationContract || req.destinationNetworkId) {
        logger.info(
          `${fnTag} - parameters of destination network will be ignored for a READ task`,
        );
      }

      if (!req.sourceNetworkId || !req.sourceContract) {
        throw new Error(
          `${fnTag} - missing required parameters for executing READ task. Requirements: sourceNetworkId, sourceContract`,
        );
      }

      if (
        !req.sourceContract.methodName ||
        !req.sourceContract.contractName ||
        !req.sourceContract.params
      ) {
        throw new Error(
          `${fnTag} - missing required parameters in sourceContract for executing READ task. Requirements: methodName, contractName, params`,
        );
      }

      taskType = OracleTaskTypeEnum.Read;
      break;
    }
    case "UPDATE": {
      if (req.sourceContract || req.sourceNetworkId) {
        logger.info(
          `${fnTag} - parameters of source network will be ignored for an UPDATE task`,
        );
      }

      if (!req.destinationNetworkId || !req.destinationContract) {
        throw new Error(
          `${fnTag} - missing required parameters for executing UPDATE task. Requirements: destinationNetworkId, destinationContract`,
        );
      }

      if (
        !req.destinationContract.methodName ||
        !req.destinationContract.contractName ||
        !req.destinationContract.params
      ) {
        throw new Error(
          `${fnTag} - missing required parameters in sourceContract for executing READ task. Requirements: methodName, contractName, params`,
        );
      }

      taskType = OracleTaskTypeEnum.Update;
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
          `${fnTag} - missing required parameters for executing READ_AND_UPDATE task. Requirements: sourceNetworkId, sourceContract, destinationNetworkId, destinationContract`,
        );
      }

      if (
        !req.sourceContract.methodName ||
        !req.sourceContract.contractName ||
        !req.sourceContract.params
      ) {
        throw new Error(
          `${fnTag} - missing required parameters in sourceContract for executing READ_AND_UPDATE task. Requirements: methodName, contractName, params`,
        );
      }

      if (
        !req.destinationContract.methodName ||
        !req.destinationContract.contractName
      ) {
        throw new Error(
          `${fnTag} - missing required parameters in destinationContract for executing READ_AND_UPDATE task. Requirements: methodName, contractName`,
        );
      }

      taskType = OracleTaskTypeEnum.ReadAndUpdate;
      break;
    }
    default:
      throw new Error(`${fnTag} - unknown task type ${req.taskType}`);
  }

  const task: OracleTask = {
    id: uuidv4(),
    type: taskType,
    srcNetworkId: req.sourceNetworkId,
    srcContract: req.sourceContract as BusinessLogicContract,
    dstNetworkId: req.destinationNetworkId,
    dstContract: req.destinationContract as BusinessLogicContract,
    timestamp: Date.now(),
    status: OracleTaskStatusEnum.Active,
    operations: [],
    mode: OracleTaskModeEnum.Immediate,
  };

  // execute the task
  const response = await manager.executeTask(task);

  return response;
}
