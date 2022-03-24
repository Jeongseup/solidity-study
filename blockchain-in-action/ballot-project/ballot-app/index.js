const express = require('express')
const app = express()

app.use(express.static('src')) // 퍼블릭 웹 아티팩트
app.use(express.static('../ballot-contract/build/contracts')) // 스마트 컨트랙트 JSON interface
app.get('/', function (req, res) {
    res.render('index.html')
})

app.listen(3000, function () {
    console.log('Exmaple app listening on port 3000!')
    console.log(`http://localhost:3000`)
})
