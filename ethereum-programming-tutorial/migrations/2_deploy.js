const Token = artifacts.require('Token')
const dBank = artifacts.require('dBank')

module.exports = async function (deployer) {
    //deploy Token
    await deployer.deploy(Token)
    //assign token into variable to get it's address
    const tokenContract = await Token.deployed()
    //pass token address for dBank contract(for future minting)
    await deployer.deploy(dBank, tokenContract.address)
    //assign dBank contract into variable to get it's address
    const dBankContract = await dBank.deployed()
    //change token's owner/minter from deployer to dBank
    await tokenContract.passMinterRole(dBankContract.address)
}
