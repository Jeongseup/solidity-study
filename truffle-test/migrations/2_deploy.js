const HelloWorld = artifacts.require('HelloWorld')

module.exports = async function (deployer) {
    // ERC20 토큰 컨트랙트를 배포
    await deployer.deploy(HelloWorld)
}
