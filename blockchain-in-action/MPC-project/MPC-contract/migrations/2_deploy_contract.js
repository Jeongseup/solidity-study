const MPC = artifacts.require('MPC')

module.exports = function (deployer) {
    deployer.deploy(MPC, '0xF14F714B0e7e6b45251B615A3F9a9C5cE4791097')
}
