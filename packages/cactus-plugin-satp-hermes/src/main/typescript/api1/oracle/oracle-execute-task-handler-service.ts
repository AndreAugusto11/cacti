// todo implement service by calling internal compomnents (public functions of oracle manager)
/*
GOAL
Goal is to implement an oracle that allows data transfers, keeping accountability. gateway notarizes data (produces a proof with bungee) and persists the data on target + notarization

IDEA:
instead of Register data transfer task,that is ran on specific conditions, do a one-time data transfer task

input parameters include
4. if event name, then also event fields 5. if function endponit, which method and parameters
6. session id (for data transfer)
7. (optional) callbackurl for notifications
smart contract addresses, functions, and parameters for source and target chains, etc

returns an ID (of data transfer task, taskID) to be used in the status endpoint;
*/

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { OracleManager } from "../../cross-chain-mechanisms/oracle/oracle-manager";
import { OracleExecuteRequest, OracleExecuteResponse } from "../../public-api";
import {
  IOracleTask,
  OracleTaskStatusEnum,
  OracleTaskType,
} from "../../cross-chain-mechanisms/oracle/oracle-types";
import { v4 as uuidv4 } from "uuid";

export async function executeTask(
  logLevel: LogLevelDesc,
  req: OracleExecuteRequest,
  manager: OracleManager,
): Promise<OracleExecuteResponse> {
  const fnTag = `executeTask()`;
  const logger = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  logger.info(`${fnTag}, executing task execution endpoint`);

  let taskType;

  switch (req.taskType) {
    case "READ": {
      if (!req.sourceNetwork || !req.sourceContract || !req.readFunction) {
        throw new Error(`${fnTag} - missing required parameters for READ task`);
      }
      taskType = OracleTaskType.READ;
      break;
    }
    case "UPDATE": {
      if (
        !req.destinationNetwork ||
        !req.destinationContract ||
        !req.writeFunction
      ) {
        throw new Error(
          `${fnTag} - missing required parameters for UPDATE task`,
        );
      }
      taskType = OracleTaskType.UPDATE;
      break;
    }
    case "READ_AND_UPDATE": {
      if (
        !req.sourceNetwork ||
        !req.sourceContract ||
        !req.readFunction ||
        !req.destinationNetwork ||
        !req.destinationContract ||
        !req.writeFunction
      ) {
        throw new Error(
          `${fnTag} - missing required parameters for READ_AND_UPDATE task`,
        );
      }
      taskType = OracleTaskType.READ_AND_UPDATE;
      break;
    }
    default:
      throw new Error(`${fnTag} - unknown task type ${req.taskType}`);
  }

  const task: IOracleTask = {
    id: uuidv4(),
    type: taskType,
    srcNetworkId: req.sourceNetwork,
    srcContractAddress: req.sourceContract,
    srcFunctionName: req.readFunction,
    dstNetworkId: req.destinationNetwork,
    dstContractAddress: req.destinationContract,
    dstFunctionName: req.writeFunction,
    timestamp: Date.now(),
    status: OracleTaskStatusEnum.ACTIVE,
    outputs: [],
    operations: [],
  };

  // execute the task
  const result = await manager.executeTask(task);

  return {
    taskID: result.id,
    outputs: result.outputs.map((output) => JSON.stringify(output)),
  };
}
