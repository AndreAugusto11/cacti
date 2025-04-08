import {
  IListenOptions,
  Logger,
  LoggerProvider,
  LogLevelDesc,
  Secp256k1Keys,
  Servers,
} from "@hyperledger/cactus-common";
import {
  AssetTokenTypeEnum,
  Configuration,
} from "../../../main/typescript/generated/gateway-client/typescript-axios";
import {
  FABRIC_25_LTS_AIO_FABRIC_VERSION,
  FABRIC_25_LTS_AIO_IMAGE_VERSION,
  FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
  FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_2,
  FabricTestLedgerV1,
} from "@hyperledger/cactus-test-tooling";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  ConnectionProfile,
  DefaultEventHandlerStrategy,
  FabricSigningCredential,
  IPluginLedgerConnectorFabricOptions,
  PluginLedgerConnectorFabric,
  DefaultApi as FabricApi,
  FabricContractInvocationType,
  FileBase64,
  ChainCodeProgrammingLanguage,
} from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { DiscoveryOptions, X509Identity } from "fabric-network";
import { Config } from "node-ssh";
import { randomUUID as uuidv4 } from "node:crypto";
import { IPluginBungeeHermesOptions } from "@hyperledger/cactus-plugin-bungee-hermes";
import fs from "fs-extra";
import path from "path";
import { expect } from "@jest/globals";
import { ClaimFormat } from "../../../main/typescript/generated/proto/cacti/satp/v02/common/message_pb";
import bodyParser from "body-parser";
import express from "express";
import http, { Server } from "http";
import { AddressInfo } from "net";
import { Asset, NetworkId } from "../../../main/typescript";
import { LedgerType } from "@hyperledger/cactus-core-api";
import {
  IFabricLeafNeworkOptions,
  IFabricLeafOptions,
} from "../../../main/typescript/cross-chain-mechanisms/bridge/leafs/fabric-leaf";
import ExampleOntology from "../../ontologies/ontology-satp-erc20-interact-fabric.json";
import { OntologyManager } from "../../../main/typescript/cross-chain-mechanisms/bridge/ontology/ontology-manager";
import { INetworkOptions } from "../../../main/typescript/cross-chain-mechanisms/bridge/bridge-types";
// Test environment for Fabric ledger operations
export class FabricTestEnvironment {
  public static readonly FABRIC_ASSET_ID: string = "FabricExampleAsset";
  public static readonly FABRIC_REFERENCE_ID: string = ExampleOntology.id;
  public static readonly FABRIC_NETWORK_ID: string = "FabricLedgerTestNetwork";
  public readonly network: NetworkId = {
    id: FabricTestEnvironment.FABRIC_NETWORK_ID,
    ledgerType: LedgerType.Fabric2,
  };
  public ledger!: FabricTestLedgerV1;
  public connectorOptions!: IPluginLedgerConnectorFabricOptions;
  public connector!: PluginLedgerConnectorFabric;
  public bungeeOptions!: IPluginBungeeHermesOptions;
  public userIdentity!: X509Identity;
  public bridgeProfile!: ConnectionProfile;
  public connectionProfile!: ConnectionProfile;
  public keychainPluginBridge!: PluginKeychainMemory;
  public keychainEntryKeyBridge!: string;
  public keychainEntryValueBridge!: string;
  public fabricSigningCredential!: FabricSigningCredential;
  public bridgeFabricSigningCredential!: FabricSigningCredential;
  public pluginRegistryBridge!: PluginRegistry;
  public sshConfig!: Config;
  public discoveryOptions!: DiscoveryOptions;
  public configFabric!: Configuration;
  public fabricChannelName!: string;
  public satpContractName!: string;
  public clientId!: string;
  public fabricConfig!: IFabricLeafNeworkOptions;
  public fabricServer!: Server;
  public apiClient!: FabricApi;
  public wrapperContractName?: string;

  private readonly log: Logger;

  private bridgeMSPID?: string;
  public bridgeIdentity?: X509Identity;

  private constructor(satpContractName: string, logLevel: LogLevelDesc) {
    this.satpContractName = satpContractName;

    const level = logLevel || "INFO";
    const label = "FabricTestEnvironment";
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  // Initializes the Ethereum ledger, accounts, and connector for testing
  public async init(logLevel: LogLevelDesc): Promise<void> {
    this.ledger = new FabricTestLedgerV1({
      emitContainerLogs: true,
      publishAllPorts: true,
      imageName: "ghcr.io/hyperledger/cactus-fabric2-all-in-one",
      imageVersion: FABRIC_25_LTS_AIO_IMAGE_VERSION,
      envVars: new Map([["FABRIC_VERSION", FABRIC_25_LTS_AIO_FABRIC_VERSION]]),
    });
    await this.ledger.start();

    this.fabricChannelName = "mychannel";

    this.connectionProfile = await this.ledger.getConnectionProfileOrgX("org1");
    this.bridgeProfile = await this.ledger.getConnectionProfileOrgX("org2");
    expect(this.connectionProfile).not.toBeUndefined();
    expect(this.bridgeProfile).not.toBeUndefined();

    const enrollAdminOut = await this.ledger.enrollAdmin();
    const adminWallet = enrollAdminOut[1];
    const enrollAdminBridgeOut = await this.ledger.enrollAdminV2({
      organization: "org2",
    });
    const bridgeWallet = enrollAdminBridgeOut[1];
    [this.userIdentity] = await this.ledger.enrollUser(adminWallet);
    const opts = {
      enrollmentID: "bridge",
      organization: "org2",
      wallet: bridgeWallet,
    };
    [this.bridgeIdentity] = await this.ledger.enrollUserV2(opts);
    this.bridgeMSPID = this.bridgeIdentity!.mspId;
    this.sshConfig = await this.ledger.getSshConfig();

    this.log.debug("enrolled admin");

    const keychainInstanceId = uuidv4();
    const keychainId = uuidv4();
    const keychainEntryKey = "user1";
    const keychainEntryValue = JSON.stringify(this.userIdentity);

    const keychainPlugin = new PluginKeychainMemory({
      instanceId: keychainInstanceId,
      keychainId,
      logLevel,
      backend: new Map([
        [keychainEntryKey, keychainEntryValue],
        ["some-other-entry-key", "some-other-entry-value"],
      ]),
    });

    const pluginRegistry = new PluginRegistry({ plugins: [keychainPlugin] });

    const keychainInstanceIdBridge = uuidv4();
    const keychainIdBridge = uuidv4();
    this.keychainEntryKeyBridge = "user2";
    this.keychainEntryValueBridge = JSON.stringify(this.bridgeIdentity);

    this.keychainPluginBridge = new PluginKeychainMemory({
      instanceId: keychainInstanceIdBridge,
      keychainId: keychainIdBridge,
      logLevel,
      backend: new Map([
        [this.keychainEntryKeyBridge, this.keychainEntryValueBridge],
        ["some-other-entry-key", "some-other-entry-value"],
      ]),
    });

    this.pluginRegistryBridge = new PluginRegistry({
      plugins: [this.keychainPluginBridge],
    });

    this.discoveryOptions = {
      enabled: true,
      asLocalhost: true,
    };

    this.connectorOptions = {
      instanceId: uuidv4(),
      dockerBinary: "/usr/local/bin/docker",
      peerBinary: "/fabric-samples/bin/peer",
      goBinary: "/usr/local/go/bin/go",
      pluginRegistry,
      cliContainerEnv: FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
      sshConfig: this.sshConfig,
      logLevel,
      connectionProfile: this.connectionProfile,
      discoveryOptions: this.discoveryOptions,
      eventHandlerOptions: {
        strategy: DefaultEventHandlerStrategy.NetworkScopeAllfortx,
        commitTimeout: 300,
      },
    };

    this.connector = new PluginLedgerConnectorFabric(this.connectorOptions);

    this.fabricSigningCredential = {
      keychainId,
      keychainRef: keychainEntryKey,
    };
    this.bridgeFabricSigningCredential = {
      keychainId: keychainIdBridge,
      keychainRef: this.keychainEntryKeyBridge,
    };

    const expressApp = express();
    expressApp.use(bodyParser.json({ limit: "250mb" }));
    this.fabricServer = http.createServer(expressApp);
    const listenOptions: IListenOptions = {
      hostname: "127.0.0.1",
      port: 3000,
      server: this.fabricServer,
    };
    const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
    const { address, port } = addressInfo;

    await this.connector.getOrCreateWebServices();
    await this.connector.registerWebServices(expressApp);

    this.log.info("Fabric Ledger connector check");

    const apiUrl = `http://${address}:${port}`;

    this.configFabric = new Configuration({ basePath: apiUrl });

    this.apiClient = new FabricApi(this.configFabric);
  }

  public getTestContractName(): string {
    return this.satpContractName;
  }

  public getTestChannelName(): string {
    return this.fabricChannelName;
  }

  public getTestOwnerSigningCredential(): FabricSigningCredential {
    return this.fabricSigningCredential;
  }

  public getTestOwnerAccount(): string {
    return this.clientId;
  }

  public getBridgeMSPID(): string {
    if (this.bridgeMSPID === undefined) {
      throw new Error("Bridge MSPID is undefined");
    }
    return this.bridgeMSPID;
  }

  public getNetworkId(): string {
    return this.network.id;
  }

  public getNetworkType(): LedgerType {
    return this.network.ledgerType;
  }

  // Creates and initializes a new FabricTestEnvironment instance
  public static async setupTestEnvironment(
    satpContractName: string,
    logLevel: LogLevelDesc,
  ): Promise<FabricTestEnvironment> {
    const instance = new FabricTestEnvironment(satpContractName, logLevel);
    await instance.init(logLevel);
    return instance;
  }

  // this is the config to be loaded by the gateway, does not contain the log level because it will use the one in the gateway config
  public createFabricConfig(): INetworkOptions {
    return {
      networkIdentification: this.fabricConfig.networkIdentification,
      userIdentity: this.bridgeIdentity,
      channelName: this.fabricConfig.channelName,
      targetOrganizations: this.fabricConfig.targetOrganizations,
      caFile: this.fabricConfig.caFile,
      ccSequence: this.fabricConfig.ccSequence,
      orderer: this.fabricConfig.orderer,
      ordererTLSHostnameOverride: this.fabricConfig.ordererTLSHostnameOverride,
      connTimeout: this.fabricConfig.connTimeout,
      signaturePolicy: this.fabricConfig.signaturePolicy,
      mspId: this.bridgeMSPID,
      wrapperContractName: this.fabricConfig.wrapperContractName,
      connectorOptions: {
        dockerBinary: this.connectorOptions.dockerBinary,
        peerBinary: this.connectorOptions.peerBinary,
        goBinary: this.connectorOptions.goBinary,
        cliContainerEnv: FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
        sshConfig: this.connectorOptions.sshConfig,
        connectionProfile: this.bridgeProfile,
        discoveryOptions: this.connectorOptions.discoveryOptions,
        eventHandlerOptions: this.connectorOptions.eventHandlerOptions,
      },
      claimFormats: this.fabricConfig.claimFormats,
    } as INetworkOptions;
  }

  // this is the config to be loaded by the gateway to use with docker, does not contain the log level because it will use the one in the gateway config
  public createFabricDockerConfig(): INetworkOptions {
    return {
      networkIdentification: this.fabricConfig.networkIdentification,
      userIdentity: this.bridgeIdentity,
      channelName: this.fabricConfig.channelName,
      targetOrganizations: this.fabricConfig.targetOrganizations, //?.map(
      //   (org) => ({
      //     ...org,
      //     CORE_PEER_ADDRESS: org.CORE_PEER_ADDRESS.replace(
      //       /peer0\.(org\d+)\.example\.com/,
      //       "172.17.0.1",
      //     ),
      //   }),
      // ),
      caFile: this.fabricConfig.caFile,
      ccSequence: this.fabricConfig.ccSequence,
      orderer: this.fabricConfig.orderer, //?.replace(
      //   "orderer.example.com",
      //   "172.17.0.1",
      // ),
      ordererTLSHostnameOverride: this.fabricConfig.ordererTLSHostnameOverride,
      connTimeout: this.fabricConfig.connTimeout,
      signaturePolicy: this.fabricConfig.signaturePolicy,
      mspId: this.bridgeMSPID,
      wrapperContractName: this.fabricConfig.wrapperContractName,
      connectorOptions: {
        dockerBinary: this.connectorOptions.dockerBinary,
        peerBinary: this.connectorOptions.peerBinary,
        goBinary: this.connectorOptions.goBinary,
        cliContainerEnv: {
          //this.connectorOptions.cliContainerEnv,
          ...FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
          CORE_PEER_ADDRESS:
            FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1.CORE_PEER_ADDRESS.replace(
              "peer0.org1.example.com",
              "172.17.0.1",
            ),
        },
        sshConfig: {
          ...this.connectorOptions.sshConfig,
          host: "172.17.0.1",
        },
        connectionProfile: {
          ...this.bridgeProfile,
          peers: Object.fromEntries(
            Object.entries(this.bridgeProfile.peers).map(([key, value]) => [
              key,
              { ...value, url: value.url.replace("localhost", "172.17.0.1") },
            ]),
          ),
          certificateAuthorities: Object.fromEntries(
            Object.entries(this.bridgeProfile.certificateAuthorities ?? {}).map(
              ([key, value]) => [
                key,
                { ...value, url: value.url.replace("localhost", "172.17.0.1") },
              ],
            ),
          ),
          orderers: Object.fromEntries(
            Object.entries(this.bridgeProfile.orderers ?? {}).map(
              ([key, value]) => [
                key,
                { ...value, url: value.url.replace("localhost", "172.17.0.1") },
              ],
            ),
          ),
        },
        discoveryOptions: {
          ...this.connectorOptions.discoveryOptions,
          asLocalhost: false, // the satp docker container does not have the network as host, so the host is in 172.17.0.1 instead of localhost
        },
        eventHandlerOptions: {
          ...this.connectorOptions.eventHandlerOptions,
          asLocalhost: false, // the satp docker container does not have the network as host, so the host is in 172.17.0.1 instead of localhost
        },
      },
      claimFormats: this.fabricConfig.claimFormats,
    } as INetworkOptions;
  }

  // this creates the same config as the bridge manager does
  public createFabricLeafConfig(
    ontologyManager: OntologyManager,
    logLevel?: LogLevelDesc,
  ): IFabricLeafOptions {
    return {
      networkIdentification: this.fabricConfig.networkIdentification,
      signingCredential: this.fabricConfig.signingCredential,
      ontologyManager: ontologyManager,
      channelName: this.fabricConfig.channelName,
      targetOrganizations: this.fabricConfig.targetOrganizations,
      caFile: this.fabricConfig.caFile,
      ccSequence: this.fabricConfig.ccSequence,
      orderer: this.fabricConfig.orderer,
      ordererTLSHostnameOverride: this.fabricConfig.ordererTLSHostnameOverride,
      connTimeout: this.fabricConfig.connTimeout,
      signaturePolicy: this.fabricConfig.signaturePolicy,
      mspId: this.bridgeMSPID,
      wrapperContractName: this.fabricConfig.wrapperContractName,
      connectorOptions: {
        instanceId: uuidv4(),
        dockerBinary: this.connectorOptions.dockerBinary,
        peerBinary: this.connectorOptions.peerBinary,
        goBinary: this.connectorOptions.goBinary,
        pluginRegistry: this.pluginRegistryBridge,
        cliContainerEnv: FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
        sshConfig: this.connectorOptions.sshConfig,
        logLevel: logLevel,
        connectionProfile: this.bridgeProfile,
        discoveryOptions: this.connectorOptions.discoveryOptions,
        eventHandlerOptions: this.connectorOptions.eventHandlerOptions,
      },
      claimFormats: this.fabricConfig.claimFormats,
      logLevel: logLevel,
    };
  }

  public async checkBalance(
    contractName: string,
    channelName: string,
    account: string,
    amount: string,
    signingCredential: FabricSigningCredential,
  ): Promise<void> {
    const responseBalance1 = await this.apiClient.runTransactionV1({
      contractName: contractName,
      channelName: channelName,
      params: [account],
      methodName: "ClientIDAccountBalance",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: signingCredential,
    });

    expect(responseBalance1).not.toBeUndefined();
    expect(responseBalance1.status).toBeGreaterThan(199);
    expect(responseBalance1.status).toBeLessThan(300);
    expect(responseBalance1.data).not.toBeUndefined();
    expect(responseBalance1.data.functionOutput).toBe(amount);
  }

  public async giveRoleToBridge(mspID: string): Promise<void> {
    if (this.bridgeMSPID === undefined) {
      throw new Error("Bridge MSPID is undefined");
    }
    const setBridgeResponse = await this.apiClient.runTransactionV1({
      contractName: this.satpContractName,
      channelName: this.fabricChannelName,
      params: [mspID],
      methodName: "setBridge",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: this.fabricSigningCredential,
    });

    expect(setBridgeResponse).not.toBeUndefined();
    expect(setBridgeResponse.status).toBeGreaterThan(199);
    expect(setBridgeResponse.status).toBeLessThan(300);

    this.log.info(
      `SATPWrapper.setBridge(): ${JSON.stringify(setBridgeResponse.data)}`,
    );
  }

  public async approveAmount(
    bridgeAddress: string,
    amount: string,
  ): Promise<void> {
    const response = await this.apiClient.runTransactionV1({
      contractName: this.satpContractName,
      channelName: this.fabricChannelName,
      params: [bridgeAddress, amount],
      methodName: "Approve",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: this.fabricSigningCredential,
    });

    expect(response).not.toBeUndefined();
    expect(response.status).toBeGreaterThan(199);
    expect(response.status).toBeLessThan(300);

    this.log.info(`SATPWrapper.Approve(): ${JSON.stringify(response.data)}`);
  }

  // Deploys smart contracts and sets up configurations for testing
  public async deployAndSetupContracts(claimFormat: ClaimFormat) {
    this.satpContractName = "satp-contract";
    const satpContractRelPath =
      "./../fabric/contracts/satp-contract/chaincode-typescript";
    const satpContractDir = path.join(__dirname, satpContractRelPath);

    // ├── package.json
    // ├── src
    // │   ├── index.ts
    // │   ├── ITraceableContract.ts
    // │   ├── satp-contract-interface.ts
    // │   ├── satp-contract.ts
    // ├── tsconfig.json
    // ├── lib
    // │   └── tokenERC20.js
    // --------
    const satpSourceFiles: FileBase64[] = [];
    {
      const filename = "./tsconfig.json";
      const relativePath = "./";
      const filePath = path.join(satpContractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      satpSourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./package.json";
      const relativePath = "./";
      const filePath = path.join(satpContractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      satpSourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./index.ts";
      const relativePath = "./src/";
      const filePath = path.join(satpContractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      satpSourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./ITraceableContract.ts";
      const relativePath = "./src/";
      const filePath = path.join(satpContractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      satpSourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./satp-contract-interface.ts";
      const relativePath = "./src/";
      const filePath = path.join(satpContractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      satpSourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./satp-contract.ts";
      const relativePath = "./src/";
      const filePath = path.join(satpContractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      satpSourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./tokenERC20.ts";
      const relativePath = "./src/";
      const filePath = path.join(satpContractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      satpSourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }

    const res = await this.apiClient.deployContractV1({
      channelId: this.fabricChannelName,
      ccVersion: "1.0.0",
      sourceFiles: satpSourceFiles,
      ccName: this.satpContractName,
      targetOrganizations: [
        FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
        FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_2,
      ],
      caFile:
        FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1.ORDERER_TLS_ROOTCERT_FILE,
      ccLabel: "satp-contract",
      ccLang: ChainCodeProgrammingLanguage.Typescript,
      ccSequence: 1,
      orderer: "orderer.example.com:7050",
      ordererTLSHostnameOverride: "orderer.example.com",
      connTimeout: 60,
    });

    const { packageIds, lifecycle, success } = res.data;
    expect(res.status).toBe(200);
    expect(success).toBe(true);
    expect(lifecycle).not.toBeUndefined();

    const {
      approveForMyOrgList,
      installList,
      queryInstalledList,
      commit,
      packaging,
      queryCommitted,
    } = lifecycle;

    expect(packageIds).toBeTruthy();
    expect(Array.isArray(packageIds)).toBe(true);

    expect(approveForMyOrgList).toBeTruthy();
    expect(Array.isArray(approveForMyOrgList)).toBe(true);

    expect(installList).toBeTruthy();
    expect(Array.isArray(installList)).toBe(true);
    expect(queryInstalledList).toBeTruthy();
    expect(Array.isArray(queryInstalledList)).toBe(true);

    expect(commit).toBeTruthy();
    expect(packaging).toBeTruthy();
    expect(queryCommitted).toBeTruthy();
    this.log.info("SATP Contract deployed");

    const initializeResponse = await this.apiClient.runTransactionV1({
      contractName: this.satpContractName,
      channelName: this.fabricChannelName,
      params: [this.userIdentity.mspId, FabricTestEnvironment.FABRIC_ASSET_ID],
      methodName: "InitToken",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: this.fabricSigningCredential,
    });

    expect(initializeResponse).not.toBeUndefined();
    expect(initializeResponse.status).toBeGreaterThan(199);
    expect(initializeResponse.status).toBeLessThan(300);

    this.log.info(
      `SATPContract.InitToken(): ${JSON.stringify(initializeResponse.data)}`,
    );

    if (this.bridgeMSPID === undefined) {
      throw new Error("Bridge MSPID is undefined");
    }

    const responseClientId = await this.apiClient.runTransactionV1({
      contractName: this.satpContractName,
      channelName: this.fabricChannelName,
      params: [],
      methodName: "ClientAccountID",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: this.fabricSigningCredential,
    });

    this.clientId = responseClientId.data.functionOutput.toString();

    this.bungeeOptions = {
      keyPair: Secp256k1Keys.generateKeyPairsBuffer(),
      instanceId: uuidv4(),
      pluginRegistry: new PluginRegistry(),
    };

    this.connectorOptions = {
      instanceId: uuidv4(),
      dockerBinary: "/usr/local/bin/docker",
      peerBinary: "/fabric-samples/bin/peer",
      goBinary: "/usr/local/go/bin/go",
      pluginRegistry: this.pluginRegistryBridge,
      cliContainerEnv: FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_2,
      sshConfig: this.sshConfig,
      logLevel: "DEBUG",
      connectionProfile: this.bridgeProfile,
      discoveryOptions: this.discoveryOptions,
      eventHandlerOptions: {
        strategy: DefaultEventHandlerStrategy.NetworkScopeAllfortx,
        commitTimeout: 300,
      },
    };

    this.fabricConfig = {
      targetOrganizations: [
        FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
        FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_2,
      ],
      caFile:
        FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_2.ORDERER_TLS_ROOTCERT_FILE,
      ccSequence: 1,
      orderer: "orderer.example.com:7050",
      ordererTLSHostnameOverride: "orderer.example.com",
      connTimeout: 60,
      networkIdentification: this.network,
      signingCredential: this.bridgeFabricSigningCredential,
      channelName: this.fabricChannelName,
      mspId: this.bridgeMSPID,
      wrapperContractName: this.wrapperContractName,
      connectorOptions: this.connectorOptions,
      claimFormats: [claimFormat],
    };
  }

  public async mintTokens(amount: string): Promise<void> {
    const responseMint = await this.apiClient.runTransactionV1({
      contractName: this.satpContractName,
      channelName: this.fabricChannelName,
      params: [amount],
      methodName: "Mint",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: this.fabricSigningCredential,
    });
    expect(responseMint).not.toBeUndefined();
    expect(responseMint.status).toBeGreaterThan(199);
    expect(responseMint.status).toBeLessThan(300);
    expect(responseMint.data).not.toBeUndefined();

    this.log.info(
      `Mint 100 amount asset by the owner response: ${JSON.stringify(responseMint.data)}`,
    );
  }

  // Gets the default asset configuration for testing
  public get defaultAsset(): Asset {
    return {
      id: FabricTestEnvironment.FABRIC_ASSET_ID,
      referenceId: FabricTestEnvironment.FABRIC_REFERENCE_ID,
      owner: this.clientId,
      contractName: this.satpContractName,
      mspId: this.userIdentity.mspId,
      channelName: this.fabricChannelName,
      networkId: this.network,
      tokenType: AssetTokenTypeEnum.NonstandardFungible,
    };
  }

  // Returns the user identity certificate used for testing transactions
  get transactRequestPubKey(): string {
    return this.userIdentity.credentials.certificate;
  }

  // Stops and destroys the test ledger
  public async tearDown(): Promise<void> {
    await this.ledger.stop();
    await this.ledger.destroy();
    await Servers.shutdown(this.fabricServer);
  }
}
