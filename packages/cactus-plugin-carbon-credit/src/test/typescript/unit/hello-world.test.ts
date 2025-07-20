import "jest-extended";

import { PluginCarbonCredit } from "../../../main/typescript/plugin-carbon-credit";
import { IPluginCarbonCreditOptions } from "../../../main/typescript/plugin-carbon-credit";
import { PluginRegistry } from "@hyperledger/cactus-core";

const pluginOptions: IPluginCarbonCreditOptions = {
  instanceId: "test-instance-id",
  pluginRegistry: new PluginRegistry(),
  logLevel: "DEBUG",
};

const plugin = new PluginCarbonCredit(pluginOptions);

describe("Hello World Functionality", () => {
  test("Hello World functions correctly", async () => {
    const response = await plugin.helloWorld({ name: "Name" });

    expect(response).toBeDefined();
    expect(response.message).toBe("Hello, Name!");
  });
});
