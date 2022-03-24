// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ballot {
    // 투표자의 상세 정보를 담는다.
    struct Voter {
        uint weight;
        bool voted;
        uint vote;
    }

    // 제안의 상세정보를 담을 예정
    struct Proposal {
        uint voteCount;
    }

    address chairperson;
    mapping(address => Voter) voters;
    Proposal[] proposals;

    enum Phase {Init, Regs, Vote, Done} // 투표의 여러 단계 0,1,2,3 으로 나타낸다. Init이 초기단계.
    Phase public state = Phase.Init;

    modifier validPhase(Phase reqPhase) {
        require(state == reqPhase);
        _;
    }

    modifier onlyChair() {
        require(msg.sender == chairperson);
        _;
    }

    constructor (uint numProposals) { // 컨트랙트 배포자로서 의장을 설정한다.
        chairperson = msg.sender;
        voters[chairperson].weight = 2; //  테스르르 위해 가중치 2
        for (uint prop = 0; prop < numProposals; prop++) { // 파라미터 값에 따른 제안 개수 생성
            proposals.push(Proposal(0));
        }
        state = Phase.Regs; // Regs 단계로 변경
    }

    // 단계 변화 함수, 의장만 실행가능
    function changeState(Phase x) public onlyChair {
        // 역순으로 바꾸려고 한다면 되돌림
        // if (x < state) revert(); => 통상적으로 if 대신 require 사용
        require(x > state);
        state = x;
    }

    // 투표자 등록 의장만 등록?
    function register(address voter) public validPhase(Phase.Regs) 
        onlyChair {
            // if (msg.sender != chairperson || voters[voter].voted ) revert();
            require(!voters[voter].voted);
            voters[voter].weight = 1;
            voters[voter].voted = false;
        }
    

    function vote(uint toProposal) public validPhase(Phase.Vote) {
        // struct 데이터 타입은 기본적으로 storage 타입이라 함수 안에서 반드시 선언
        Voter memory sender = voters[msg.sender]; 
        // if (sender.voted || toProposal >= proposals.length) revert();
        
        require(!sender.voted); // 투표하지 않아야 한다.
        require(toProposal < proposals.length);

        sender.voted = true;
        sender.vote = toProposal;
        proposals[toProposal].voteCount += sender.weight;
    }

    function reqWinner() public validPhase(Phase.Done) view returns (uint winningProposal) { // 읽기용 함수 기록 X
        uint winningVoteCount = 0;
        for(uint prop = 0; prop < proposals.length; prop++) {
            if (proposals[prop].voteCount > winningVoteCount) {
                winningVoteCount = proposals[prop].voteCount;
                winningProposal = prop;
            }
        }
        // 예외를 다루기 위한 것. 보통은 실패하지 않아야 하는 경우를 가정.
        // assert 실패가 require 실패보다 더 가스비용이 크다.
        // 따라서 assert는 간헐적으로 예외처리를 우해 사용한다.
        assert(winningVoteCount > 3);
    }
}