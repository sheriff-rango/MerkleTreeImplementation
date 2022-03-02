/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BytesLike,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SimpleRewardDistributor,
  SimpleRewardDistributorInterface,
} from "../SimpleRewardDistributor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "merkleRoot_",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Claimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "isClaimed",
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
  {
    inputs: [],
    name: "merkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b506040516105f53803806105f58339818101604052604081101561003357600080fd5b508051602090910151606082901b6001600160601b03191660805260a08190526001600160a01b039091169061056f6100866000398061020f52806103ae52508061028052806103e7525061056f6000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80632e7ba6ef146100515780632eb4a7ab146100df5780639e34070f146100f9578063fc0c546a1461012a575b600080fd5b6100dd6004803603608081101561006757600080fd5b8135916001600160a01b03602082013516916040820135919081019060808101606082013564010000000081111561009e57600080fd5b8201836020820111156100b057600080fd5b803590602001918460208302840111640100000000831117156100d257600080fd5b50909250905061014e565b005b6100e76103ac565b60408051918252519081900360200190f35b6101166004803603602081101561010f57600080fd5b50356103d0565b604080519115158252519081900360200190f35b6101326103e5565b604080516001600160a01b039092168252519081900360200190f35b610157856103d0565b156101935760405162461bcd60e51b81526004018080602001828103825260288152602001806104ce6028913960400191505060405180910390fd5b600085858560405160200180848152602001836001600160a01b031660601b8152601401828152602001935050505060405160208183030381529060405280519060200120905061023a8383808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152507f000000000000000000000000000000000000000000000000000000000000000092508591506104099050565b6102755760405162461bcd60e51b81526004018080602001828103825260218152602001806104f66021913960400191505060405180910390fd5b61027e866104b2565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb86866040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b1580156102f557600080fd5b505af1158015610309573d6000803e3d6000fd5b505050506040513d602081101561031f57600080fd5b505161035c5760405162461bcd60e51b81526004018080602001828103825260238152602001806105176023913960400191505060405180910390fd5b604080518781526001600160a01b038716602082015280820186905290517f4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed0269181900360600190a1505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60009081526020819052604090205460ff1690565b7f000000000000000000000000000000000000000000000000000000000000000081565b600081815b85518110156104a757600086828151811061042557fe5b6020026020010151905080831161046c578281604051602001808381526020018281526020019250505060405160208183030381529060405280519060200120925061049e565b808360405160200180838152602001828152602001925050506040516020818303038152906040528051906020012092505b5060010161040e565b509092149392505050565b6000908152602081905260409020805460ff1916600117905556fe4d65726b6c654469737472696275746f723a2044726f7020616c726561647920636c61696d65642e4d65726b6c654469737472696275746f723a20496e76616c69642070726f6f662e4d65726b6c654469737472696275746f723a205472616e73666572206661696c65642ea2646970667358221220bfe64ac3f2e3082c7a081f080e3b73622e7c6944137fcdad704da0b4f7930edd64736f6c63430007000033";

type SimpleRewardDistributorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SimpleRewardDistributorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SimpleRewardDistributor__factory extends ContractFactory {
  constructor(...args: SimpleRewardDistributorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "SimpleRewardDistributor";
  }

  deploy(
    token_: string,
    merkleRoot_: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SimpleRewardDistributor> {
    return super.deploy(
      token_,
      merkleRoot_,
      overrides || {}
    ) as Promise<SimpleRewardDistributor>;
  }
  getDeployTransaction(
    token_: string,
    merkleRoot_: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(token_, merkleRoot_, overrides || {});
  }
  attach(address: string): SimpleRewardDistributor {
    return super.attach(address) as SimpleRewardDistributor;
  }
  connect(signer: Signer): SimpleRewardDistributor__factory {
    return super.connect(signer) as SimpleRewardDistributor__factory;
  }
  static readonly contractName: "SimpleRewardDistributor";
  public readonly contractName: "SimpleRewardDistributor";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SimpleRewardDistributorInterface {
    return new utils.Interface(_abi) as SimpleRewardDistributorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SimpleRewardDistributor {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SimpleRewardDistributor;
  }
}