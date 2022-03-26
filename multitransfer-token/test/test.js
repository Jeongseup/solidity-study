import { ETHER_ADDRESS, EVM_REVERT } from './helpers'

const Token = artifacts.require('Token')
const MultiTransfer = artifacts.require('MultiTransfer')

require('chai').use(require('chai-as-promised')).should()

contract('Token Contract', ([deployer, user]) => {
    let tokenContract
    const initSupply = 2100 * 10000

    beforeEach(async () => {
        tokenContract = await Token.new()
        console.log('New token contract deployed by beforeEach')
    }).describe('First Test is Token contract deployed correctly', () => {
        // 정상인 경우 확인
        // token name is "Test Token"
        // token ticker is "TOKEN"
        describe('[SUCESS DESCRIBE]', () => {
            it('checking token name', async () => {
                // 토큰 이름 정상인지 확인
                expect(await token.name()).to.be.eq('Test Token')
            })

            it('checking token symbol', async () => {
                // 토큰 심볼 정상인지 확인
                expect(await token.symbol()).to.be.eq('TOKEN')
            })

            it('checking token initial total supply', async () => {
                // 토큰 초기 공급량 확인
                expect(Number(await token.totalSupply())).to.eq(initSupply)
            })
        })
        // 실패인 경우 확인
        describe('[FAILURE DESCRIBE]', () => {})
    })
})

// describe('testing withdraw...', () => {
//   let balance

//   describe('success', () => {

//     beforeEach(async () => {
//       await dbank.deposit({value: 10**16, from: user}) //0.01 ETH

//       await wait(2) //accruing interest

//       balance = await web3.eth.getBalance(user)
//       await dbank.withdraw({from: user})
//     })

//     it('balances should decrease', async () => {
//       expect(Number(await web3.eth.getBalance(dbank.address))).to.eq(0)
//       expect(Number(await dbank.etherBalanceOf(user))).to.eq(0)
//     })

//     it('user should receive ether back', async () => {
//       expect(Number(await web3.eth.getBalance(user))).to.be.above(Number(balance))
//     })

//     it('user should receive proper amount of interest', async () => {
//       //time synchronization problem make us check the 1-3s range for 2s deposit time
//       balance = Number(await token.balanceOf(user))
//       expect(balance).to.be.above(0)
//       expect(balance%interestPerSecond).to.eq(0)
//       expect(balance).to.be.below(interestPerSecond*4)
//     })

//     it('depositer data should be reseted', async () => {
//       expect(Number(await dbank.depositStart(user))).to.eq(0)
//       expect(Number(await dbank.etherBalanceOf(user))).to.eq(0)
//       expect(await dbank.isDeposited(user)).to.eq(false)
//     })
//   })

//   describe('failure', () => {
//     it('withdrawing should be rejected', async () =>{
//       await dbank.deposit({value: 10**16, from: user}) //0.01 ETH
//       await wait(2) //accruing interest
//       await dbank.withdraw({from: deployer}).should.be.rejectedWith(EVM_REVERT) //wrong user
//     })
//   })
// })
