const { getCSVData } = require('./helper')
const { expect } = require('chai')
const Token = artifacts.require('Token')
const MultiTransfer = artifacts.require('MultiTransfer')
const csvFilePath = __dirname + '/example.csv'

contract('Token', function ([delpoyer, user]) {
    let tokenContract
    const initSupply = 2100 * 10000

    describe('토큰 컨트랙트가 제대로 배포되었는지 테스트합니다.', () => {
        // init
        before(async () => {
            tokenContract = await Token.new()
        })

        it('토큰 이름 확인', async () => {
            expect(await tokenContract.name()).to.be.eq('Test Token')
        })

        it('토큰 티거 확인', async () => {
            expect(await tokenContract.symbol()).to.be.eq('TOKEN')
        })

        it('토큰 초기 공급량', async () => {
            expect(Number(await tokenContract.totalSupply())).to.eq(initSupply)
        })

        it('배포자의 토큰 밸런스 확인', async () => {
            expect(Number(await tokenContract.balanceOf(delpoyer))).to.eq(
                initSupply
            )
        })
    })
})

contract('MultiTransfer', (accounts) => {
    let tokenContract, multiTransferContract, csvData

    // 테스트 환경 변수 세팅
    const deployerAddress = accounts[0] // 배포자
    let receiverAddresses = [accounts[1], accounts[2]] // 토큰 받는 사람들
    let receiverAmounts = [5000, 5000]
    let totalAmount = 10000

    describe('멀티트랜스퍼 컨트랙트가 정상적으로 작동하는지 테스트합니다.', () => {
        // init
        before(async () => {
            csvData = await getCSVData(csvFilePath)
            tokenContract = await Token.new()
            multiTransferContract = await MultiTransfer.new()
            await tokenContract.approve(
                multiTransferContract.address,
                totalAmount
            )
        })

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

        it('멀티 트랜스퍼 토큰 전송 함수 확인', async () => {
            // (ERC20 토큰주소, 받는 사람 주소, 받을 토큰양, 총 토큰량)
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

        it('토큰 분배 후 잔여 approve가 0인지 확인', async () => {
            expect(
                Number(
                    await tokenContract.allowance(
                        deployerAddress,
                        multiTransferContract.address
                    )
                )
            ).to.be.eq(0)
        })
    })

    describe('CSV파일 내 데이터로 다시 테스트합니다.', () => {
        // init
        before(async () => {
            csvData = await getCSVData(csvFilePath)
            tokenContract = await Token.new()
            multiTransferContract = await MultiTransfer.new()

            // 초기화
            receiverAddresses = []
            receiverAmounts = []
            totalAmount = null

            for (user of csvData) {
                receiverAddresses.push(user['ADDRESS'])
                receiverAmounts.push(Number(user['AMOUNT']))
            }

            totalAmount = receiverAmounts.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            )
            await tokenContract.approve(
                multiTransferContract.address,
                totalAmount
            )
        })

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

        it('멀티 트랜스퍼 토큰 전송 함수 확인', async () => {
            // (ERC20 토큰주소, 받는 사람 주소, 받을 토큰양, 총 토큰량)
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

        it('토큰 분배 후 잔여 approve가 0인지 확인', async () => {
            expect(
                Number(
                    await tokenContract.allowance(
                        deployerAddress,
                        multiTransferContract.address
                    )
                )
            ).to.be.eq(0)
        })
    })
})
