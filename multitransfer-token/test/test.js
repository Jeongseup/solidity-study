// import { EVM_REVERT } from './helpers'
const { expect } = require('chai')
const Token = artifacts.require('./Token')
const MultiTransfer = artifacts.require('./MultiTransfer')

contract('Test', async ([deployer, user]) => {
    console.log('Test')
    let tokenContract
    const initSupply = 2100 * 10000

    describe('describe', async () => {
        tokenContract = await Token.new()

        it('checking token name', async () => {
            // 토큰 이름 정상인지 확인
            expect(await tokenContract.name()).to.be.eq('Test Token2')
        })
    })
})
// contract('Token Contract', (accounts) => {

//         console.log('New token contract deployed by beforeEach')
//     }).describe('First Test is Token contract deployed correctly', () => {
//         // 정상인 경우 확인
//         // token name is "Test Token"
//         // token ticker is "TOKEN"
//         describe('[SUCESS DESCRIBE]', () => {
//             it('checking token name', async () => {
//                 // 토큰 이름 정상인지 확인
//                 expect(await token.name()).to.be.eq('Test Token')
//             })

//             it('checking token symbol', async () => {
//                 // 토큰 심볼 정상인지 확인
//                 expect(await token.symbol()).to.be.eq('TOKEN')
//             })

//             it('checking token initial total supply', async () => {
//                 // 토큰 초기 공급량 확인
//                 expect(Number(await token.totalSupply())).to.eq(initSupply)
//             })
//         })
//         // 실패인 경우 확인
//         describe('[FAILURE DESCRIBE]', () => {})
//     })
// })
