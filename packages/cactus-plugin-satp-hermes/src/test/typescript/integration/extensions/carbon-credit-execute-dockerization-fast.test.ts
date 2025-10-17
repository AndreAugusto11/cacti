import "jest-extended";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import {
  pruneDockerAllIfGithubAction,
  Containers,
  SATPGatewayRunner,
  ISATPGatewayRunnerConstructorOptions,
} from "@hyperledger/cactus-test-tooling";
import {
  Address,
  GatewayIdentity,
} from "../../../../main/typescript/core/types";
import { setupGatewayDockerFiles, CI_TEST_TIMEOUT } from "../../test-utils";
import {
  DEFAULT_PORT_GATEWAY_CLIENT,
  DEFAULT_PORT_GATEWAY_OAPI,
  DEFAULT_PORT_GATEWAY_SERVER,
  SATP_ARCHITECTURE_VERSION,
  SATP_CORE_VERSION,
  SATP_CRASH_VERSION,
} from "../../../../main/typescript/core/constants";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  DefaultApi as CarbonCreditApi,
  getTokenAddressBySymbol,
  Marketplace,
  Network,
} from "@hyperledger/cactus-plugin-carbon-credit";
import {
  SATP_DOCKER_IMAGE_NAME,
  SATP_DOCKER_IMAGE_VERSION,
} from "../../constants";
import { ExtensionType } from "../../../../main/typescript/extensions/extensions-utils";
import { ExtensionConfig } from "../../../../main/typescript/services/validation/config-validating-functions/validate-extensions";
import { ethers } from "ethers";

const logLevel: LogLevelDesc = "TRACE";
const log = LoggerProvider.getOrCreate({
  level: logLevel,
  label: "SATP - Hermes",
});

let gatewayRunner: SATPGatewayRunner;
let carbonCreditApi: CarbonCreditApi;

const testNetwork = "test-network";

const gatewayAddress = "gateway.satp-hermes";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// This is the address of a Polygon wallet with a good amount of USDC. It was randomly selected
const impersonatedAddress = "0xfa0b641678f5115ad8a8de5752016bd1359681b9";

const walletObject = {
  address: impersonatedAddress,
  privateKey: "", // private key not needed for impersonated account
  providerURL: "http://host.docker.internal:8545",
};

afterAll(async () => {
  await gatewayRunner.stop();
  await gatewayRunner.destroy();

  await pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });
}, CI_TEST_TIMEOUT);

beforeAll(async () => {
  const address: Address = `http://${gatewayAddress}`;

  // gateway setup:
  const gatewayIdentity = {
    id: "mockID",
    name: "CustomGateway",
    version: [
      {
        Core: SATP_CORE_VERSION,
        Architecture: SATP_ARCHITECTURE_VERSION,
        Crash: SATP_CRASH_VERSION,
      },
    ],
    proofID: "mockProofID10",
    address,
    gatewayClientPort: DEFAULT_PORT_GATEWAY_CLIENT,
    gatewayServerPort: DEFAULT_PORT_GATEWAY_SERVER,
    gatewayOapiPort: DEFAULT_PORT_GATEWAY_OAPI,
  } as GatewayIdentity;

  const extensions = [
    {
      name: ExtensionType.CARBON_CREDIT,
      networksConfig: [
        {
          network_name: Network.Polygon,
          rpc_url: "http://host.docker.internal:8545",
        },
      ],
      signingCredential: {
        // Below is the default Hardhat dev account
        ethAccount: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        secret:
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        type: "PRIVATE_KEY_HEX",
      },
    } as ExtensionConfig,
  ];

  // gateway configuration setup:
  const files = setupGatewayDockerFiles({
    gatewayIdentity,
    logLevel,
    counterPartyGateways: [], //only knows itself
    enableCrashRecovery: false, // Crash recovery disabled
    extensions,
  });

  // gatewayRunner setup:
  const gatewayRunnerOptions: ISATPGatewayRunnerConstructorOptions = {
    containerImageVersion: SATP_DOCKER_IMAGE_VERSION,
    containerImageName: SATP_DOCKER_IMAGE_NAME,
    logLevel,
    emitContainerLogs: true,
    configPath: files.configPath,
    logsPath: files.logsPath,
    ontologiesPath: files.ontologiesPath,
    networkName: testNetwork,
    url: gatewayAddress,
  };

  gatewayRunner = new SATPGatewayRunner(gatewayRunnerOptions);
  log.debug("starting gatewayRunner...");
  await gatewayRunner.start(true);
  log.debug("gatewayRunner started successfully");

  carbonCreditApi = new CarbonCreditApi(
    new Configuration({
      basePath: `http://${await gatewayRunner.getOApiHost()}`,
    }),
  );
}, CI_TEST_TIMEOUT);

describe("Test reachability to Carbon Credit Plugin through SATP Gateway extensions functionality", () => {
  it("should be able to call getAvailableTCO2sRequest of carbon credit plugin through the extensions", async () => {
    const response = await carbonCreditApi.getAvailableTCO2sRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      orderBy: "supply",
      limit: "100",
    });

    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.data).toBeTruthy();
    expect(response.data.tco2List).toBeInstanceOf(Array);
    expect(response.data.tco2List.length).toBeGreaterThan(0);
  });

  test("Retire function retires specifically purchased TCO2s successfully via API client", async () => {
    await provider.send("hardhat_impersonateAccount", [impersonatedAddress]);

    // Step 2: Get available TCO2s and select 3
    const tco2sResponse = await carbonCreditApi.getAvailableTCO2sRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      orderBy: "supply",
    });
    expect(tco2sResponse).toBeDefined();
    expect(Array.isArray(tco2sResponse.data.tco2List)).toBeTrue();
    expect(tco2sResponse.data.totalCount).toBeGreaterThan(0);

    const randomIndex = Math.floor(
      Math.random() * (tco2sResponse.data.tco2List.length - 3),
    );
    const selectedTCO2s = tco2sResponse.data.tco2List.slice(
      randomIndex,
      randomIndex + 3,
    );

    // Step 3: Buy each TCO2 specifically
    const items: Record<string, string> = {};
    selectedTCO2s.forEach((tco2) => {
      items[tco2.address] = ethers.parseUnits("400", 18).toString();
    });

    const specificBuyResponse = await carbonCreditApi.specificBuyRequest({
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      paymentToken: getTokenAddressBySymbol(Network.Polygon, "USDC"),
      items,
      walletObject: walletObject,
    });
    expect(specificBuyResponse).toBeDefined();
    expect(specificBuyResponse.data.txHashSwap).toBeDefined();
    expect(specificBuyResponse.data.buyTxHash).toBeDefined();
    expect(specificBuyResponse.data.assetAmounts).toBeDefined();
    expect(specificBuyResponse.data.assetAmounts.length).toBe(3);
    for (const assetAmount of specificBuyResponse.data.assetAmounts) {
      expect(assetAmount.amount).toBe("360000000000000000000");
    }

    // Step 4: Retire all specifically purchased TCO2s
    const retireItems: Record<string, string> = {};
    selectedTCO2s.forEach((tco2) => {
      retireItems[tco2.address] = ethers.parseUnits("200", 18).toString();
    });

    const retireRequest = {
      marketplace: Marketplace.Toucan,
      network: Network.Polygon,
      entityName: "Unit Test Entity",
      tco2s: Object.keys(retireItems),
      amounts: Object.values(retireItems),
      beneficiaryAddress: impersonatedAddress,
      beneficiaryName: "Unit Test Beneficiary",
      message: "Retired for specific buy test",
      retirementReason: "Unit testing specific buy retire",
      walletObject: walletObject,
    };

    const retireResponse = await carbonCreditApi.retireRequest(retireRequest);

    expect(retireResponse).toBeDefined();
    expect(retireResponse.data.txHashesRetire).toBeDefined();
    expect(retireResponse.data.txHashesRetire.length).toBe(
      selectedTCO2s.length,
    );
    expect(retireResponse.data.retirementCertificateIds).toBeDefined();
    expect(retireResponse.data.retirementCertificateIds.length).toBe(
      selectedTCO2s.length,
    );

    // Step 5: Log certificates (on-chain verification can be added if needed)
    for (const certificateId of retireResponse.data.retirementCertificateIds) {
      log.info(
        `Retirement certificate ${certificateId} created for specific buy test.`,
      );
    }
  });
});
