const Token = artifacts.require('Token')
const MultiTransfer = artifacts.require('MultiTransfer')

module.exports = async function (deployer) {
    // ERC20 토큰 컨트랙트를 배포
    await deployer.deploy(Token)
    const tokenContract = await Token.deployed() // constructor() 변수할당

    // MultiTransfer 컨트랙트 배포
    await deployer.deploy(MultiTransfer)
    const multiTransferContract = await MultiTransfer.deployed() // constructor() 변수할당

    // 이후 초기세팅이 필요하면 설정
    // await tokenContract.approve(...)
}
