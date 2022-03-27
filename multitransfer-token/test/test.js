const { getCSVData } = require('./helper')
const { expect } = require('chai')
const Token = artifacts.require('Token')
const MultiTransfer = artifacts.require('MultiTransfer')
const csvFilePath = __dirname + '/example.csv'

/*
contract('Token', function ([delpoyer, user]) {
    let tokenContract
    const initSupply = 2100 * 10000

    // init for test loop
    beforeEach(async () => {
        tokenContract = await Token.new()
    })

    describe('토큰 컨트랙트가 제대로 배포되었는지 테스트합니다.', () => {
        describe('success', () => {
            it('토큰 이름 확인', async () => {
                expect(await tokenContract.name()).to.be.eq('Test Token')
            })

            it('토큰 티거 확인', async () => {
                expect(await tokenContract.symbol()).to.be.eq('TOKEN')
            })

            it('토큰 초기 공급량', async () => {
                // 토큰 초기 공급량 0이 맞는지 확인
                expect(Number(await tokenContract.totalSupply())).to.eq(
                    initSupply
                )
            })

            it('배포자의 토큰 밸런스 확인', async () => {
                expect(Number(await tokenContract.balanceOf(delpoyer))).to.eq(
                    initSupply
                )
            })
        })
    })
})
*/
contract('MultiTransfer', (accounts) => {
    let tokenContract, multiTransferContract, csvData

    // 사용자 셋팅
    const deployerAddress = accounts[0] // 배포자
    const receiverAddresses = [accounts[1], accounts[2]] // 토큰 받는 사람들
    const receiverAmounts = [5000, 5000]
    const totalAmount = 10000

    beforeEach(async () => {
        // csvData = await getCSVData(csvFilePath)
        tokenContract = await Token.new()
        multiTransferContract = await MultiTransfer.new()
        await tokenContract.approve(multiTransferContract.address, totalAmount)
    })

    describe('멀티트랜스퍼 컨트랙트가 정상적으로 작동하는지 테스트합니다.', () => {
        it('토큰 approve 확인', async () => {
            expect(
                Number(
                    await tokenContract.allowance(
                        deployerAddress,
                        multiTransferContract.address
                    )
                )
            ).to.be.eq(totalAmount)
        })

        it('토큰 전송 확인', async () => {
            // address _token,
            // address[] calldata _addresses,
            // uint256[] calldata _amounts,
            // uint256 _amountSum

            await multiTransferContract.multiTransferToken(
                tokenContract.address,
                receiverAddresses,
                receiverAmounts,
                totalAmount
            )

            for (let i = 0; i < receiverAddresses.length; i++) {
                expect(
                    Number(await tokenContract.balanceOf(receiverAddresses[i]))
                ).to.eq(receiverAmounts[i])
            }
        })
    })
})
