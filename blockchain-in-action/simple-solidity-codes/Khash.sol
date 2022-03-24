// SPDX-License-Identifier: GPL3
pragma solidity ^0.8.0;

contract Khash {
    
    bytes32 public hashedValue;

    function hashMe(uint value1, bytes32 password) public {
        hashedValue = keccak256(abi.encodePacked(value1, password));
    }
}