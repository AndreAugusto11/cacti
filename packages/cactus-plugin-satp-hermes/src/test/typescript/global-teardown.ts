import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import {
  Containers,
  pruneDockerAllIfGithubAction,
} from "@hyperledger/cactus-test-tooling";

const logLevel: LogLevelDesc = "TRACE";
const log = LoggerProvider.getOrCreate({
  level: logLevel,
  label: "GlobalTeardown",
});

module.exports = async function globalTeardown() {
  log.info("Global Teardown Started");

  // Stop and remove containers
  if ((global as any).__DB_LOCAL__) {
    await (global as any).__DB_LOCAL__.stop();
    await (global as any).__DB_LOCAL__.remove();
  }

  if ((global as any).__DB_REMOTE__) {
    await (global as any).__DB_REMOTE__.stop();
    await (global as any).__DB_REMOTE__.remove();
  }

  if ((global as any).__BESU_ENV__) {
    await (global as any).__BESU_ENV__.tearDown();
  }

  if ((global as any).__FABRIC_ENV__) {
    await (global as any).__FABRIC_ENV__.tearDown();
  }

  if ((global as any).__ETHEREUM_ENV__) {
    await (global as any).__ETHEREUM_ENV__.tearDown();
  }

  await pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });

  log.info("Global Teardown Finished");
};
