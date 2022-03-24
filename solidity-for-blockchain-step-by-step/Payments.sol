pragma solidity ^0.8.0;

contract HotelRoom {

    // Vacant
    // Occupied
    enum Statuses { Vacant, Occupied }
    Statuses public currentStatus;

    event Occupy(address _ocuupant, uint _value);

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
        currentStatus = Statuses.Vacant;
    }

    modifier onlyWhileVacant {
        // Check status
        require(currentStatus == Statuses.Vacant, "Currently occupied.");
        _;
    }

    modifier costs(uint _amount) {
        // Check price
        require(msg.value >= _amount, "Not enough Ether provided.");
        _;
    }

    receive() external payable onlyWhileVacant costs(2 ether) {
        currentStatus = Statuses.Occupied;
        owner.transfer(msg.value);
        emit Occupy(msg.sender, msg.value);
    }
}