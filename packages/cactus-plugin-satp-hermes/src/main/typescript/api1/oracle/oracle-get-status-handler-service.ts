// todo implement service by calling internal compomnents (public functions of oracle manager)
/*
user provides the status id given by register endpoint, and gets a status
TBD define data model for status, suggestion: NOT_FOUND, INVALID, PENDING, SUCCESS, FAILED

returns a status and useful data to confirm such status (eg bungee notarizations, tx hashes, etc)
*/

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { OracleManager } from "../../cross-chain-mechanisms/oracle/oracle-manager";
import { OracleStatusRequest, OracleStatusResponse } from "../../public-api";

export async function getTaskStatus(
  logLevel: LogLevelDesc,
  req: OracleStatusRequest,
  manager: OracleManager,
): Promise<OracleStatusResponse> {
  const fnTag = `executeTask()`;
  const logger = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  logger.info(`${fnTag}, executing task status endpoint`);

  if (!req.taskID) {
    throw new Error(`${fnTag} - missing required parameters for task status`);
  }

  const result = await manager.getTask(req.taskID);

  return {
    taskID: result.id,
  };
}
