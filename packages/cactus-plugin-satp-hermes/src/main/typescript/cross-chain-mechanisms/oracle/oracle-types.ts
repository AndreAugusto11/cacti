import { PluginBungeeHermes } from "@hyperledger/cactus-plugin-bungee-hermes";
import { IPluginLedgerConnectorBesuOptions } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { IPluginLedgerConnectorFabricOptions } from "@hyperledger/cactus-plugin-ledger-connector-fabric";

export interface IOracleResponse {
  transactionId?: string;
  transactionReceipt?: string;
  output?: unknown;
}

export enum OracleTaskType {
  READ = "READ",
  UPDATE = "UPDATE",
  READ_AND_UPDATE = "READ_AND_UPDATE",
}

export enum OracleTaskStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type IOracleTask = {
  id: string;
  type: OracleTaskType;
  outputs: IOracleResponse[];
  srcNetworkId?: string;
  srcContractAddress?: string;
  srcFunctionName?: string;
  srcFunctionParams?: string[];
  dstNetworkId?: string;
  dstContractAddress?: string;
  dstFunctionName?: string;
  dstFunctionParams?: string[];
  timestamp: number;
  operations: IOracleOperation[];
  status: OracleTaskStatusEnum;
  // callbackUrl?: string;
};

export enum OracleRepeatableTaskMode {
  EVENT_LISTENING = "EVENT_LISTENING",
  POLLING = "POLLING",
}

export type IOracleRepeatableTask = IOracleTask & {
  mode: OracleRepeatableTaskMode;
  taskInterval?: number;
  srcEventSignature?: string;
  // trigger: () => void;
};

export enum OracleOperationStatusEnum {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export type IOracleOperation = {
  id: string;
  type: IOracleOperationType;
  networkId: string;
  contractAddress: string;
  functionName?: string;
  functionParams?: string[];
  status: OracleOperationStatusEnum;
  output?: IOracleResponse;
  timestamp: number;
  // callbackUrl?: string;
};

export enum IOracleOperationType {
  READ = "READ",
  UPDATE = "UPDATE",
  READ_AND_UPDATE = "READ_AND_UPDATE",
}

export interface IOracleManagerOptions {
  logLevel?: string;
  instanceId: string;
  fabricConnectorConfig?: IPluginLedgerConnectorFabricOptions | undefined;
  ethereumConnectorConfig?: IPluginLedgerConnectorBesuOptions | undefined;
  bungee: PluginBungeeHermes | undefined;
  initialTasks?: IOracleTask[];
}
