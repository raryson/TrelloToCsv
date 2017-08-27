const fs = require('fs')
const jsonexport = require('jsonexport')

module.exports = {
    generateCSV(content, callback) {
        return new Promise(
            (resolve, reject) => {
                jsonexport(content, function (err, csv) {
                    if (err) return console.log(err)
                    fs.writeFile('dumpCards.csv', csv, function (err) {
                        if (err) reject(err)
                        resolve()
                    })
                })
            })
    }
}


