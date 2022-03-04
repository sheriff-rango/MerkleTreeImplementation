import fs from "fs"; // Filesystem
import path from "path"; // Path routing
import Generator from "./generator"; // Generator
import { logger } from "./utils/logger"; // Logging

// Config file path
const configPath: string = path.join(__dirname, "../config.json");
const contractPath: string = path.join(
  __dirname,
  "../../deployments/rinkeby/SimpleRewardDistributorFlat.json"
);

/**
 * Throws error and exists process
 * @param {string} erorr to log
 */
function throwErrorAndExit(error: string): void {
  logger.error(error);
  process.exit(1);
}

(async () => {
  // Check if config exists
  if (!fs.existsSync(configPath)) {
    throwErrorAndExit("Missing config.json. Please add.");
  }

  // Read config
  const configFile: Buffer = await fs.readFileSync(configPath);
  const configData = JSON.parse(configFile.toString());

  if (!fs.existsSync(contractPath)) {
    throwErrorAndExit(
      "Missing SimpleRewardDistributorFlat.json in deployments/rinkeby. Please deploy contract first."
    );
  }

  // Check configData
  if (
    isNaN(configData["index"]) ||
    !configData["address"] ||
    !configData["privateKey"] ||
    !configData["amount"] ||
    !configData["leaves"] ||
    configData["leaves"].length === 0 ||
    !configData["alchemyApiKey"]
  ) {
    throwErrorAndExit("Invalid config file. Please check.");
  }

  // Collect config
  const index = configData["index"];
  const address = configData["address"];
  const privateKey = configData["privateKey"];
  const amount = configData["amount"];
  const leaves = configData["leaves"].map((leaf: any) =>
    Buffer.from(leaf.data, "hex")
  );
  const alchemyApiKey = configData["alchemyApiKey"];

  // Initialize and call generator
  const generator = new Generator(
    index,
    address,
    privateKey,
    amount,
    leaves,
    alchemyApiKey
  );
  await generator.process();
})();
