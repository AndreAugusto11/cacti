import {
  type ILoggerOptions,
  type Logger,
  LoggerProvider,
  type LogLevelDesc,
} from "@hyperledger/cactus-common";

import { ExtensionType } from "./extensions-utils";
import { ICactusPlugin } from "@hyperledger/cactus-core-api";
import { PluginCarbonCredit } from "@hyperledger/cactus-plugin-carbon-credit";
import { Web3SigningCredentialType } from "@hyperledger/cactus-plugin-ledger-connector-ethereum";

export interface IExtensionsManagerOptions {
  logLevel?: LogLevelDesc;
  extensions: ExtensionType[];
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

    options.extensions.forEach((extension) => {
      this.addExtension(extension);
    });
  }

  public getExtensions(): Map<ExtensionType, ICactusPlugin> {
    return this.extensions;
  }

  public addExtension(extension: ExtensionType): void {
    const fnTag = `${ExtensionsManager.CLASS_NAME}#addExtension()`;
    if (!extension) {
      throw new Error(`${fnTag}: Extension is required`);
    }

    switch (extension) {
      case ExtensionType.CARBON_CREDIT:
        this.logger.info(`${fnTag}: Adding Carbon Credit extension`);

        const plugin = new PluginCarbonCredit({
          instanceId: "carbon-credit-plugin",
          signingCredential: {
            type: Web3SigningCredentialType.PrivateKeyHex,
            ethAccount: "0xYourEthereumAccount",
            secret: "0xYourPrivateKeyHex",
          },
          logLevel: this.logLevel,
        });

        this.extensions.set(ExtensionType.CARBON_CREDIT, plugin);
      case ExtensionType.DIGITAL_PRODUCT_PASSPORT:
        this.logger.info(`${fnTag}: Adding Digital Product Passport extension`);
        break;
      default:
        this.logger.warn(`${fnTag}: Unsupported extension type: ${extension}`);
        throw new Error(`${fnTag}: Unsupported extension type: ${extension}`);
    }
  }
}
