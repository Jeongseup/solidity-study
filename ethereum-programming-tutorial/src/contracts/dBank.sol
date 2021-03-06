// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {

  //assign Token contract to variable
  Token private token;
  
  //add mappings
  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public depositStart;
  mapping(address => bool) public isDeposited;
  
  //add events
  event Deposit(address indexed user, uint etherAmount, uint timeStart);

  //pass as constructor argument deployed Token contract
  constructor(Token _token) {
    token = _token;
  }

  function deposit() payable public {
    require(isDeposited[msg.sender] == false, '[ERROR] Deposit already active');
    require(msg.value >= 1e16, '[ERROR] deposit must be >= 0.01 ETH');
    //check if msg.sender didn't already deposited funds
    //check if msg.value is >= than 0.01 ETH
    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
    
    //start msg.sender hodling time
    // 근데 이거 그냥 블록타임해야하지 않나?
    // depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp; 
    depositStart[msg.sender] = block.timestamp;

    //set msg.sender deposit status to true
    isDeposited[msg.sender] = true;

    //emit Deposit event
    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  function withdraw() public {
    //check if msg.sender deposit status is true
    //assign msg.sender ether deposit balance to variable for event

    //check user's hodl time

    //calc interest per second
    //calc accrued interest

    //send eth to user
    //send interest in tokens to user

    //reset depositer data

    //emit event
  }

  function borrow() payable public {
    //check if collateral is >= than 0.01 ETH
    //check if user doesn't have active loan

    //add msg.value to ether collateral

    //calc tokens amount to mint, 50% of msg.value

    //mint&send tokens to user

    //activate borrower's loan status

    //emit event
  }

  function payOff() public {
    //check if loan is active
    //transfer tokens from user back to the contract

    //calc fee

    //send user's collateral minus fee

    //reset borrower's data

    //emit event
  }
}