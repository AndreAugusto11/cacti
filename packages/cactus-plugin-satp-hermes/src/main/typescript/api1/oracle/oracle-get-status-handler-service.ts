// todo implement service by calling internal compomnents (public functions of oracle manager)
/*
user provides the status id given by register endpoint, and gets a status
TBD define data model for status, suggestion: NOT_FOUND, INVALID, PENDING, SUCCESS, FAILED

returns a status and useful data to confirm such status (eg bungee notarizations, tx hashes, etc)
*/

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
// import { SATPManager } from "../../services/gateway/satp-manager";
import { OracleStatusRequest, OracleStatusResponse } from "../../public-api";

export async function executeGetOracleStatus(
  logLevel: LogLevelDesc,
  req: OracleStatusRequest,
  // manager: SATPManager,
): Promise<OracleStatusResponse> {
  const fnTag = `executeGetOracleStatus()`;
  const logger = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  if (req.contextID === null && req.taskID === null) {
    throw new Error(`${fnTag}, contextID or taskID must be provided.`);
  }

  if (req.contextID !== null) {
    logger.info(`${fnTag}, Obtaining status for contextID=${req.contextID}`);
  } else {
    logger.info(`${fnTag}, Obtaining status for taskID=${req.taskID}`);
  }

  try {
    // const result = await getOracleStatusService(logLevel, req, manager);
    return {} as OracleStatusResponse;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`${fnTag}, Error getting status: ${error.message}`);
      throw error;
    } else {
      logger.error(`${fnTag}, Unexpected error: ${error.message}`);
      throw new Error("An unexpected error occurred while obtaining status.");
    }
  }
}
