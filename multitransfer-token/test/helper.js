const fs = require('fs')
const csv = require('csv-parser')

module.exports.getCSVData = (filePath) => {
    // const inputFilePath = __dirname + '/example.csv'
    let csvData = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', function (row) {
                try {
                    csvData.push(row)
                } catch (err) {
                    reject(err)
                }
            })
            .on('end', function () {
                console.log(csvData)
                resolve(csvData)
            })
    })
}
