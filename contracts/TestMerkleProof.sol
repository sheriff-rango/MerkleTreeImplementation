// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

library MerkleProof {
    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     */
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf,
        uint256 index
    ) internal pure returns (bool) {
        bytes32 hash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }

            index = index / 2;
        }

        return hash == root;
    }

    // function verify(
    //     bytes32[] memory proof,
    //     bytes32 root,
    //     bytes32 leaf
    // ) internal pure returns (bool) {
    //     bytes32 computedHash = leaf;

    //     for (uint256 i = 0; i < proof.length; i++) {
    //         bytes32 proofElement = proof[i];

    //         if (computedHash <= proofElement) {
    //             // Hash(current computed hash + current element of the proof)
    //             computedHash = keccak256(
    //                 abi.encodePacked(computedHash, proofElement)
    //             );
    //         } else {
    //             // Hash(current element of the proof + current computed hash)
    //             computedHash = keccak256(
    //                 abi.encodePacked(proofElement, computedHash)
    //             );
    //         }
    //     }

    //     // Check if the computed hash (root) is equal to the provided root
    //     return computedHash == root;
    // }
}

contract TestMerkleProof {
    bytes32[] public hashes;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Must be owner");
        _;
    }

    function buildTestMerkleTree(string[] memory data) external isOwner {
        for (uint256 i = 0; i < data.length; i++) {
            hashes.push(keccak256(abi.encodePacked(data[i])));
        }

        uint256 n = data.length;
        uint256 offset = 0;

        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(
                            hashes[offset + i],
                            hashes[offset + i + 1]
                        )
                    )
                );
            }
            offset += n;
            n = n / 2;
        }
    }

    function getTestMerkleRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }

    function getTotalTestMerkleTree() public view returns (bytes32[] memory) {
        return hashes;
    }

    function getStringHash(string memory data) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(data));
    }

    function verifyData(string memory data, uint256 index)
        public
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(data));

        return
            MerkleProof.verify(hashes, hashes[hashes.length - 1], leaf, index);
    }

    // function verifyData(string memory data) public view returns (bool) {
    //     bytes32 leaf = keccak256(abi.encodePacked(data));

    //     return MerkleProof.verify(hashes, hashes[hashes.length - 1], leaf);
    // }
}
