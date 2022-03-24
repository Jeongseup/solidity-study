// SPDX-License-Identifier: GPL-3
pragma solidity ^0.8.0;

contract MPC {

// STORAGE
    address payable public sender;
    address payable public recipient;

// INIT
    constructor(address payable reciever) {
        sender = payable(msg.sender); // 주관자와 작업자의 주소들..?
        recipient = reciever;
    }
    
// MODIFIER

// FUNCTION
    function isValidSignature(uint amount, bytes memory signedMessage)
        internal view returns (bool) {
            bytes32 message = prefixed(keccak256(abi.encodePacked(this, amount)));
            return recoverSigner(message, signedMessage) == sender; // signedMessage의 주관자 주소가 검증된다.
        }
    
    // 조건들을 충족할 경우, claimPayemnt는 작업자에게 지급?
    function claimPayment(uint amount, bytes memory signedMessage) public {
        require(msg.sender == recipient, "Not a recipient");
        require(isValidSignature(amount, signedMessage), "Signature Unmatch");
        require(address(this).balance > amount, "Insufficient Funds"); // 밸런스는 어카운트 주소의 내재적 속성
        recipient.transfer(amount);
        selfdestruct(sender); // 남은 밸런스를 주관자에게 보내고 SC 폐기
    }     
    
    // 요청 메세지로부터 서명자의 주소를 복구하는 함수1
    function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        require(sig.length == 65, "Signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        return (v, r, s);
    }
    // 요청 메세지로부터 서명자의 주소를 복구하는 함수2
    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);
        return ecrecover(message, v, r, s);
    }
    // 요청 메세지로부터 서명자의 주소를 복구하는 함수3
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

}