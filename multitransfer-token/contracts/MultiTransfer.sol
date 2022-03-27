// contracts/MultiTransfer.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MultiTransfer {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  // 이벤트 추가하면 좋을 듯.
  
  function multiTransferToken(
    address _token,
    address[] calldata _addresses,
    uint256[] calldata _amounts,
    uint256 _amountSum
  ) payable external
  {

    IERC20 token = IERC20(_token);
    token.safeTransferFrom(msg.sender, address(this), _amountSum);
    for (uint8 i; i < _addresses.length; i++) {
      _amountSum = _amountSum.sub(_amounts[i]);
      token.transfer(_addresses[i], _amounts[i]);
    }
  }
}