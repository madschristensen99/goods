
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleFundraiser {
    address public owner;
    uint public deadline;
    uint public goal;
    uint public constant DONATION_AMOUNT = 0.01 ether; // Standard contribution amount set to 0.01 ETH
    uint public totalRaised;
    mapping(address => uint) public balances;

    // Fundraiser states
    enum State { Active, GoalReached, Refunding }
    State public currentState;

    constructor(uint _goal, uint _durationInDays) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + (_durationInDays * 1 days);
        currentState = State.Active;
    }

    // Main function to handle contributions, withdrawals, and refunds
    function handleFundraiser() external payable {
        if (currentState == State.Active) {
            require(block.timestamp <= deadline, "Deadline has passed");
            require(msg.value == DONATION_AMOUNT, "Fixed donation of 0.01 ETH required");
            balances[msg.sender] += msg.value;
            totalRaised += msg.value;
            if (totalRaised >= goal) {
                currentState = State.GoalReached;
            }
        } else if (currentState == State.GoalReached && msg.sender == owner) {
            payable(owner).transfer(totalRaised);
            currentState = State.Refunding; // Ends fundraising and starts refunding phase
        } else if (currentState == State.Refunding) {
            uint amount = balances[msg.sender];
            require(amount > 0, "No funds to refund");
            balances[msg.sender] = 0;
            payable(msg.sender).transfer(amount);
        } else {
            revert("Invalid operation");
        }
    }

    // Fallback function to prevent accidental ETH sending
    receive() external payable {
        revert("Please use the handleFundraiser function");
    }
}
