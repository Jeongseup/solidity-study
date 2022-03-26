// contracts/Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor() ERC20("Test Token", "TOKEN") {
        // 토큰 배포할 양
        _mint(msg.sender, 2100 * 10000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}