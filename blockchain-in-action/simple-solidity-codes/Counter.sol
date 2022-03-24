pragma solidity ^0.8.0;

contract Counter {
    uint value;

    function init(uint x) public {
        value = x;
    }

    function get() view public returns (uint) {
        return value;
    }

    function increment(uint n) public {
        value = value + n;
        return;
    }
}