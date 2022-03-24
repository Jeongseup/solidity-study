// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract BlindAuctionWithEvent {

// 데이터 정의
    struct Bid {
        bytes32 blindedBid;
        uint deposit;
    }

    // Enum-uint 맵핑
    // Init - 0, Bidding - 1, Reveal - 2, Done -3, 단계는 오직 운영자만이 설정 가능
    enum Phase { Init, Bidding, Reveal, Done }
    Phase public currentPhase = Phase.Init;

    address payable beneficiary; // owner, 컨트랙트 배포자가 수혜자
    mapping(address => Bid) bids;

    address public hightestBidder;
    uint public hightestBid = 0;

    mapping(address => uint) depositReturns;

// events
    event AuctionEnded(address winner, uint hightestBid);
    event BiddingStarted();
    event RevealStarted();


// modifiers
    modifier validPhase(Phase reqPhase) {
        require(currentPhase == reqPhase);
        _;
    }

    modifier onlyBeneficiary() { // 수혜자를 확인
        require(msg.sender == beneficiary);
        _;
    }

// constructor
    constructor() {
        beneficiary = payable(msg.sender);
        // state = Phase.Bidding;
    }

// functions

    function advancePhase() public onlyBeneficiary { // 함수를 재활용하기 위해 이렇게 바꿈.
        // 이미 Done 이라면 init으로 초기화
        if (currentPhase == Phase.Done) {
            currentPhase = Phase.Init;
        } else { // 그렇지 않으면 단계 증가
            // enum은 내부적으로 uints를 사용하기 때문에 uint
            uint nextPhase = uint(currentPhase) + 1;
            currentPhase = Phase(nextPhase);
        }

        if (currentPhase == Phase.Reveal) emit RevealStarted(); // 이벤트 발생
        if (currentPhase == Phase.Bidding) emit BiddingStarted();
    }
    
    function bid(bytes32 blindBid) public payable validPhase(Phase.Bidding) { // 블라인드 경매
        bids[msg.sender] = Bid({
            blindedBid : blindBid,
            deposit: msg.value
        });
    }

    function reveal(uint value, bytes32 secret) public validPhase(Phase.Reveal) { // 블라인드 입찰 확인
        uint refund = 0;
        Bid storage bidToCheck = bids[msg.sender];
        if (bidToCheck.blindedBid == keccak256(abi.encodePacked(value, secret))) {
            refund += bidToCheck.deposit;
            if (bidToCheck.deposit >= value) {
                // 내부 함수?
                if (placeBid(msg.sender, value))
                    refund -= value;
            }   
        }
    }

    // 내부 함수
    function placeBid(address bidder, uint value) internal returns (bool success) {
        if (value <= hightestBid) {
            return false;
        }
        if (hightestBidder != address(0)) {
            // 이전 최고가 입찰자에게 환불
            depositReturns[hightestBidder] += hightestBid;
        }
        hightestBid = value;
        hightestBidder = bidder;
        return true;
    }

    function withdraw() public { // 낙찰 탈락자에게 의해 호출
        uint amount = depositReturns[msg.sender];
        require(amount > 0);
        depositReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // 경매를 종료하고 수혜자에게 최고가 입찰액을 전송
    function auctionEnd() public validPhase(Phase.Done) {
        payable(beneficiary).transfer(hightestBid);
        emit AuctionEnded(hightestBidder, hightestBid);
    }
}