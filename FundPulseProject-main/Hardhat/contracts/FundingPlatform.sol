// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FundingPlatform {
    struct Proposal {
        address payable startup;
        string title;
        uint goalAmount;
        uint deadline;
        uint amountRaised;
        bool executed;
        bool goalReached;
        bool isActive;
        mapping(address => uint) contributions;
        address[] contributors;
    }

    uint public proposalCount;
    mapping(uint => Proposal) public proposals;

    // ✅ New mapping to track startup address by proposal ID
    mapping(uint => address) public proposalStartup;

    event ProposalCreated(uint indexed proposalId, address startup, string title, uint goalAmount, uint deadline);
    event Invested(uint indexed proposalId, address investor, uint amount);
    event Executed(uint indexed proposalId, uint totalAmount);
    event RefundIssued(uint indexed proposalId, address contributor, uint amount);

    function createProposal(string memory _title, uint _goalAmount, uint _duration) external {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.startup = payable(msg.sender);
        p.title = _title;
        p.goalAmount = _goalAmount;
        p.deadline = block.timestamp + _duration;
        p.executed = false;
        p.goalReached = false;
        p.isActive = true;

        // ✅ Store startup address
        proposalStartup[proposalCount] = msg.sender;

        emit ProposalCreated(proposalCount, msg.sender, _title, _goalAmount, p.deadline);
    }

    function invest(uint _proposalId) external payable {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp < p.deadline, "Deadline passed");
        require(!p.executed, "Already executed");
        require(msg.value > 0, "Must send ETH");
        require(p.isActive, "Proposal not active");

        if (p.contributions[msg.sender] == 0) {
            p.contributors.push(msg.sender);
        }

        p.amountRaised += msg.value;
        p.contributions[msg.sender] += msg.value;

        emit Invested(_proposalId, msg.sender, msg.value);

        if (p.amountRaised >= p.goalAmount) {
            p.goalReached = true;
            executeProposal(_proposalId);
        }
    }

    function executeProposal(uint _proposalId) public {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp >= p.deadline || p.amountRaised >= p.goalAmount, "Cannot execute yet");
        require(!p.executed, "Already executed");
        require(p.amountRaised > 0, "No funds to transfer");

        p.executed = true;
        p.isActive = false;
        p.goalReached = true;

        (bool success, ) = p.startup.call{value: p.amountRaised}("");
        require(success, "Transfer failed");

        emit Executed(_proposalId, p.amountRaised);
    }

    function refund(uint _proposalId) external {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp > p.deadline, "Project is still active");
        require(!p.goalReached, "Goal was reached, no refunds");
        require(p.contributions[msg.sender] > 0, "No contribution to refund");

        uint refundAmount = p.contributions[msg.sender];
        p.contributions[msg.sender] = 0;
        p.amountRaised -= refundAmount;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundIssued(_proposalId, msg.sender, refundAmount);
    }

    function getContribution(uint _proposalId, address _user) external view returns (uint) {
        return proposals[_proposalId].contributions[_user];
    }

    function getContributors(uint _proposalId) external view returns (address[] memory) {
        return proposals[_proposalId].contributors;
    }
}
