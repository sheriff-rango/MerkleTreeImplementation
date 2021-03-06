/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestMerkleProof,
  TestMerkleProofInterface,
} from "../TestMerkleProof";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "setMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]",
      },
      {
        internalType: "string",
        name: "leaf",
        type: "string",
      },
    ],
    name: "verifyData",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556103a1806100326000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80637cb647591461003b578063b81bb60014610050575b600080fd5b61004e6100493660046101e2565b610077565b005b61006361005e366004610211565b6100e7565b604051901515815260200160405180910390f35b60005473ffffffffffffffffffffffffffffffffffffffff1633146100e25760405162461bcd60e51b815260206004820152600d60248201527f4d757374206265206f776e657200000000000000000000000000000000000000604482015260640160405180910390fd5b600155565b6000610150848480806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250506001546040519092506101359150869060200161031a565b60405160208183030381529060405280519060200120610158565b949350505050565b600082610165858461016e565b14949350505050565b600081815b84518110156101da57600085828151811061019057610190610355565b602002602001015190508083116101b657600083815260208290526040902092506101c7565b600081815260208490526040902092505b50806101d28161036b565b915050610173565b509392505050565b6000602082840312156101f457600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b60008060006040848603121561022657600080fd5b833567ffffffffffffffff8082111561023e57600080fd5b818601915086601f83011261025257600080fd5b81358181111561026157600080fd5b602088818360051b860101111561027757600080fd5b80840196508195508088013593508284111561029257600080fd5b838801935088601f8501126102a657600080fd5b83359150828211156102ba576102ba6101fb565b604051601f8301601f19908116603f011681019084821181831017156102e2576102e26101fb565b816040528381528a838588010111156102fa57600080fd5b838387018483013760008385830101528096505050505050509250925092565b6000825160005b8181101561033b5760208186018101518583015201610321565b8181111561034a576000828501525b509190910192915050565b634e487b7160e01b600052603260045260246000fd5b600060001982141561038d57634e487b7160e01b600052601160045260246000fd5b506001019056fea164736f6c634300080a000a";

type TestMerkleProofConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestMerkleProofConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestMerkleProof__factory extends ContractFactory {
  constructor(...args: TestMerkleProofConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "TestMerkleProof";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestMerkleProof> {
    return super.deploy(overrides || {}) as Promise<TestMerkleProof>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TestMerkleProof {
    return super.attach(address) as TestMerkleProof;
  }
  connect(signer: Signer): TestMerkleProof__factory {
    return super.connect(signer) as TestMerkleProof__factory;
  }
  static readonly contractName: "TestMerkleProof";
  public readonly contractName: "TestMerkleProof";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestMerkleProofInterface {
    return new utils.Interface(_abi) as TestMerkleProofInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestMerkleProof {
    return new Contract(address, _abi, signerOrProvider) as TestMerkleProof;
  }
}
