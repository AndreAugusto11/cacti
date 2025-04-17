import { OracleRegisterRequestTaskModeEnum } from "../../public-api";
import {
  IOracleOperation,
  IOracleResponse,
  OracleOperationStatusEnum,
  OracleRepeatableTaskMode,
} from "./oracle-types";

export function convertToDomainOracleRepeatableTaskMode(
  mode: OracleRegisterRequestTaskModeEnum,
): OracleRepeatableTaskMode {
  switch (mode) {
    case OracleRegisterRequestTaskModeEnum.EventListening:
      return OracleRepeatableTaskMode.EVENT_LISTENING;
    case OracleRegisterRequestTaskModeEnum.Polling:
      return OracleRepeatableTaskMode.POLLING;
    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }
}

export function updateOracleOperation(
  task: IOracleOperation,
  newStatus: OracleOperationStatusEnum,
  output: IOracleResponse,
): IOracleOperation {
  return {
    ...task,
    status: newStatus,
    output: output,
  };
}
