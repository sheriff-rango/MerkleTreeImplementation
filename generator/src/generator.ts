import fs from "fs"; // Filesystem
import path from "path"; // Path routing
import keccak256 from "keccak256"; // Keccak256 hashing
import MerkleTree from "merkletreejs"; // MerkleTree.js
import { BigNumber, Contract, providers, Wallet } from "ethers";
import { getAddress, parseUnits, solidityKeccak256 } from "ethers/lib/utils"; // Ethers utils

import { logger } from "./utils/logger"; // Logging

// Contract json path
const contractPath: string = path.join(
  __dirname,
  "../../deployments/rinkeby/SimpleRewardDistributorFlat.json"
);

export default class Generator {
  // Claim configs
  CONFIG_INDEX: number = 0;
  CONFIG_ADDRESS: string = "";
  CONFIG_PRIVATEKEY: string = "";
  CONFIG_AMOUNT: string = "";
  CONFIG_LEAVES: string[] = [];
  CONFIG_ALCHEMYAPIKEY: string = "";

  /**
   * Setup generator
   * @param {index} index of user
   * @param {address} address of account
   * @param {privateKey} privateKey of account
   * @param {amount} amount of withdrawal
   * @param {leaves} leaves for merkle tree
   */
  constructor(
    index: number,
    address: string,
    privateKey: string,
    amount: string,
    leaves: string[],
    alchemyApiKey: string
  ) {
    this.CONFIG_INDEX = index;
    this.CONFIG_ADDRESS = address;
    this.CONFIG_PRIVATEKEY = privateKey;
    this.CONFIG_AMOUNT = amount;
    this.CONFIG_LEAVES = leaves;
    this.CONFIG_ALCHEMYAPIKEY = alchemyApiKey;
  }

  async process(): Promise<void> {
    logger.info("Generating Merkle tree.");

    // Generate merkle tree
    const merkleTree = new MerkleTree(this.CONFIG_LEAVES, keccak256, {
      sortPairs: true
    });

    // convert amount into BigNumber
    const amount = BigNumber.from(this.CONFIG_AMOUNT);

    // Generate leaf for verification of claimed
    const leaf = Buffer.from(
      solidityKeccak256(
        ["uint256", "address", "uint256"],
        [this.CONFIG_INDEX, this.CONFIG_ADDRESS, amount]
      ).slice(2),
      "hex"
    );

    logger.info("Generating proof.");
    // Get proof for verification
    const proof = merkleTree.getHexProof(leaf);

    logger.info("Reading contract abi and address.");
    // Read contract abi and address
    const contractFile: Buffer = await fs.readFileSync(contractPath);
    const contractData = JSON.parse(contractFile.toString());
    const contractAddress = contractData.address;
    const contractAbi = contractData.abi;

    logger.info("Getting contract.");
    const provider = new providers.JsonRpcProvider(
      `https://eth-rinkeby.alchemyapi.io/v2/${this.CONFIG_ALCHEMYAPIKEY}`
    );
    const signer = new Wallet(this.CONFIG_PRIVATEKEY, provider);
    const SimpleRewardDistributorFlatContract = new Contract(
      contractAddress,
      contractAbi,
      signer
    );

    logger.info("Start transaction");
    try {
      const txOption = {
        gasPrice: parseUnits("110", "gwei"),
        gasLimit: 2100000
      };
      const tx = await SimpleRewardDistributorFlatContract.connect(
        signer
      ).claim(
        this.CONFIG_INDEX,
        amount,
        proof
        // txOption
      );
      await tx.wait();
      logger.info("Transaction completed successfully");
      console.log(tx);
    } catch (err) {
      console.error(err);
    }
  }
}

// getMerkleRoot
