const csv = require('ya-csv')
const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const fs = require('fs')
const file = __dirname + '/dumpCards.csv'
const generateCsv = require('./controllers/generateCSV')
const trelloMethods = require('./controllers/trelloMethods')
const Trello = require('node-trello')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/board', (req, res) => {
  const t = new Trello(req.body.keyTrello, req.body.tokenTrello)
  trelloMethods.showBoards(t, (err, data) => {
    if (err) console.log(err)
    res.send(data)
  })
})

app.post('/board/lists', (req, res) => {
  const t = new Trello(req.body.keyTrello, req.body.tokenTrello)
  trelloMethods.showColuns(t, req.body.boardID, (err, data) => {
    res.send(data)
  })
})

app.post('/board/lists/labels', (req, res) => {
  const t = new Trello(req.body.keyTrello, req.body.tokenTrello)
  trelloMethods.showLabels(t, req.body.listId, req.body.listName ,(err, data) => {
    if(data.length === 0){
      res.status(500)
    }
    res.send(data)
  })
})

app.get('/teste', (req, res) => {
  res.render('home/teste')
})

app.post('/download', (req, res) => {
  const t = new Trello(req.body.keyTrello, req.body.tokenTrello)
  fs.createWriteStream('dumpCards.csv')
  trelloMethods.getTrelloCards(t, req.body.listName, req.body.registredLabels, (err, things) => {
    generateCsv.generateCSV(things).then(() => {
      res.download(file)
    })
  })

})
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('running at 3000')
})
