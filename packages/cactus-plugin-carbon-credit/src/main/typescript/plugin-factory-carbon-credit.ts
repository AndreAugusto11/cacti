import {
  IPluginFactoryOptions,
  PluginFactory,
} from "@hyperledger/cactus-core-api";
import {
  IPluginCarbonCreditOptions,
  PluginCarbonCredit,
} from "./plugin-carbon-credit";

export class PluginFactoryLedgerConnector extends PluginFactory<
  PluginCarbonCredit,
  IPluginCarbonCreditOptions,
  IPluginFactoryOptions
> {
  async create(
    pluginOptions: IPluginCarbonCreditOptions,
  ): Promise<PluginCarbonCredit> {
    return new PluginCarbonCredit(pluginOptions);
  }
}
