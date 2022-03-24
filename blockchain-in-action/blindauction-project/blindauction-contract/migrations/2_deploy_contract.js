const BlindAuctionWithEvent = artifacts.require('BlindAuctionWithEvent')

module.exports = function (deployer) {
    deployer.deploy(BlindAuctionWithEvent)
}
