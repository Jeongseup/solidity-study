# MultiTransferToken Contract

## 과제 설명

한번에 여러 주소에 특정 ERC-20 토큰을 전송하는데 사용할 이더리움 스마트 컨트랙트와 테스트 코드, 배포 스크립트를 작성하시오. (전송 대상이 되는 특정 ERC-20 토큰은 컨트랙트 생성시 설정)

입력 포맷은 다음과 같습니다. (CSV 파일로 다음과 같은 형식으로 입력 받음)

    {1번째 주소}, {1번째 주소에 보낼 해당 토큰 수량}
    {2번째 주소}, {2번째 주소에 보낼 해당 토큰 수량}

예제 (example.csv)

    ADDRESS, AMOUNT
    0xD2C82F2e5FA236E114A81173e375a73664610998, 1000000000000000000
    0xF7abA9b064a12330a00eafAA930e2fE8e76E65f0, 2000000000000000000

## 과제 풀이

##### 1. 개발 환경

과제 풀이에 사용된 개발 환경은 다음과 같습니다. (truffle version 입력시 나옴)

-   사용언어 : Javascript, Solidity
-   솔리디티 프레임워크 : Truffle v5.5.5 (core: 5.5.5)
-   이더리움 가상환경 : Ganache v^7.0.3
-   솔리디티 컴파일러 버젼 : Solidity - 0.8.12 (solc-js)
-   노드 버젼 : Node v16.13.0
-   유닛 테스트 도구 : Mocha, Chai
-   프로바이드 라이브러리 버젼 :Web3.js v1.5.3

##### 2. 전송 방식

_※ 해당 방식을 이해하기 위해서는 ERC20 컨트랙트 내 [approve,와 transferFrom 함수 작동 방식](https://medium.com/hexlant/%EC%8A%A4%EB%A7%88%ED%8A%B8-%EC%BB%A8%ED%8A%B8%EB%9E%99%ED%8A%B8-%EA%B0%9C%EB%B0%9C%EA%B3%BC%EC%A0%95%EC%97%90%EC%84%9C%EC%9D%98-%EC%8B%A4%EC%88%98-transferfrom-42141f12a7a3)에 대한 사전 이해가 필요합니다._

1. ERC20 토큰 분배자는 전송하고자 하는 토큰의 총량만큼 멀티트랜스퍼 컨트랙트 주소로 `approve(승인)` 합니다. (ERC20 컨트랙트 내 함수)

2. 이후 멀티트랜스퍼 컨트랙트 내 구현된 전송함수를 작동합니다. 함수 작동에는 `토큰 주소, 전송 대상 배열, 전송량 배열, 총 전송량` 등이 필요합니다.

3. 전송이 완료되었으니, 보낸 이와 받은 이들의 토큰 밸런스를 확인합니다.

##### 3. ERC20 컨트랙트 및 멀티트랜스퍼 컨트랙트 상세 설명

_※ 해당 부분은 비개발직군의 사람들은 건너뛰셔도 무방합니다._

먼저 ERC20 컨트랙트는 openzeppelin에 표준 상속받았습니다. 단 초기 토큰 공급량은 임의의로 고정시켜두었으며, 원할한 게산을 위해 토큰의 decimal을 0으로 낮췄습니다.

```solidity
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
```

다음은 멀티트랜스퍼 컨트랙트입니다. 멀티트랜스퍼 컨트랙트는 이전에 배포된 ERC20 컨트랙트의 주소와 받은 이들의 주소와 양을 배열`array`의 형태로 그리고 총 양을 인자로 받아 실행됩니다. 후에 원할한 작동을 위해 SafeERC20 유틸라이저를 사용하여 ERC20 컨트랙트 내 approve된 양을 각각의 주소에 전송합니다. (SafeERC20이란, return값이 없는 함수로 구현된 ERC20의 익스텐션입니다)

```solidity
contract MultiTransfer {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

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
```

##### 4. 테스트 방법

1번에서 말씀드린 Node.js 버젼을 맞게 설치하신 후 해당 레포지토리를 cloning 합니다.

-   git clone ...
-   npm install
-   truffle develop
-   truffle test

※ 만약 배포하시길 바란다면, 루트 폴더에 .env파일을 생성 후 다음과 같이 작성하시면 됩니다.

    PRIVATE_KEY = "YOUR ACCOUNT PRIVATE KEY, CHECK IN THE METAMASK OR SOMETHING"
    API_KEY = "YOUR PRIVATE KEY"
    ENDPOINT_URL = "wss://ropsten.infura.io/ws/v3/"
