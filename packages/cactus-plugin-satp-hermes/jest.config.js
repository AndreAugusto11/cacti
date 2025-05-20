module.exports = {
  // ... outras configurações existentes do Jest para o pacote SATP
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./src/test/typescript/global-setup.ts",
  globalTeardown: "./src/test/typescript/global-teardown.ts",
  testTimeout: 60000, // Ajusta conforme necessário
};
