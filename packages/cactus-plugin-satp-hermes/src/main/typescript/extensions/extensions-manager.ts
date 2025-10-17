import {
  type ILoggerOptions,
  type Logger,
  LoggerProvider,
  type LogLevelDesc,
} from "@hyperledger/cactus-common";

import { ExtensionType } from "./extensions-utils";
import { ICactusPlugin } from "@hyperledger/cactus-core-api";
import {
  PluginCarbonCredit,
  type Network,
  type NetworkConfig,
} from "@hyperledger/cactus-plugin-carbon-credit";
import { Web3SigningCredentialType } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";
import { ExtensionConfig } from "../services/validation/config-validating-functions/validate-extensions";

export interface IExtensionsManagerOptions {
  logLevel?: LogLevelDesc;
  extensionsConfig: ExtensionConfig[];
}

export class ExtensionsManager {
  public static readonly CLASS_NAME = "ExtensionsManager";
  private readonly logger: Logger;
  private readonly logLevel: LogLevelDesc = "INFO";

  // Group oracle by the network, a network can have various oracles (bridges)
  private readonly extensions: Map<ExtensionType, ICactusPlugin> = new Map();

  constructor(public readonly options: IExtensionsManagerOptions) {
    const fnTag = `${ExtensionsManager.CLASS_NAME}#constructor()`;
    if (!options) {
      throw new Error(`${fnTag}: ExtensionsManager options are required`);
    }
    const logLevel = (options.logLevel || "INFO") as LogLevelDesc;
    const loggerOptions: ILoggerOptions = {
      level: logLevel,
      label: ExtensionsManager.CLASS_NAME,
    };
    this.logger = LoggerProvider.getOrCreate(loggerOptions);
    this.logger.info(`${fnTag}: Initializing ExtensionsManager`);

    options.extensionsConfig.forEach((extension) => {
      this.addExtension(extension);
    });
  }

  public getExtensions(): Map<ExtensionType, ICactusPlugin> {
    return this.extensions;
  }

  public addExtension(extension: ExtensionConfig): void {
    const fnTag = `${ExtensionsManager.CLASS_NAME}#addExtension()`;
    if (!extension) {
      throw new Error(`${fnTag}: Extension is required`);
    }

    switch (extension.name) {
      case ExtensionType.CARBON_CREDIT:
        this.logger.info(`${fnTag}: Adding Carbon Credit extension`);

        const plugin = new PluginCarbonCredit({
          instanceId: "carbon-credit-plugin",
          networksConfig: extension.networksConfig.map((net) => ({
            network: net.network_name as Network,
            rpcUrl: net.rpc_url,
          })) as NetworkConfig[],
          signingCredential: {
            type: Web3SigningCredentialType.PrivateKeyHex,
            ethAccount: extension.signingCredential.ethAccount,
            secret: extension.signingCredential.secret,
          },
          logLevel: this.logLevel,
        });

        this.extensions.set(ExtensionType.CARBON_CREDIT, plugin);

        this.logger.debug(
          `${fnTag}: Added Carbon Credit extension with config: ${JSON.stringify(
            extension,
            null,
            2,
          )}`,
        );
        break;
      case ExtensionType.DIGITAL_PRODUCT_PASSPORT:
        this.logger.info(`${fnTag}: Adding Digital Product Passport extension`);
        break;
      default:
        this.logger.warn(`${fnTag}: Unsupported extension type: ${extension}`);
        throw new Error(`${fnTag}: Unsupported extension type: ${extension}`);
    }
  }
}
