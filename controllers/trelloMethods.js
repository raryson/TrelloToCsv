module.exports = {
  showBoards(t, callback) {
    t.get(`/1/members/me/boards`, (err, data) => {
      const boardsObject = []
      if (err) {
        return callback(err)
      }
      data.forEach((value) => {
        boardsObject.push({ "name": value.name, "id": value.shortLink })
      })
      return callback(null, boardsObject)
    })
  },
  showColuns(t, boardId, callback) {
    t.get(`/1/boards/${boardId}?lists=open&list_fields=name&fields=name,desc&`, (err, data) => {
      const listObject = []
      let lists = data.lists
      if (err) return callback(err)
      lists.forEach((value) => {
        listObject.push({ "listName": value.name, "listId": value.id })
      })
      return callback(null, listObject)
    })
  },
  showLabels(t, listId, listName, callback) {
    t.get('/1/lists/' + listId + '?cards=all&card_fields=labels,name,shortUrl&', (err, data) => {
      if (err) return callback(err)
      let newList = []
      let newListCompare = []
      data.cards.forEach((value) => {
        value.labels.forEach((val) => {
          if (newListCompare.indexOf(val.name) === -1) {
            newListCompare.push(val.name)
            newList.push(val)
          }
        })
      })
      return callback(null, newList)
    })
  },
  getTrelloCards(t, id, labelObject, callback) {
    const concatResult = []
    t.get('/1/lists/' + id + '?cards=all&card_fields=labels,name,shortUrl&', (err, data) => {
      data.cards.forEach((element, index, array) => {
        element.labels.forEach((ele, ind, arr) => {
          labelObject.forEach((labelName) => {
            if (ele.name === labelName) {
              concatResult.push({ "name": element.name, "labelName": ele.name, "elementUrl": element.shortUrl })
            }
          })
        })
      })

      const sample = concatResult.reduce((allCards, card) => {
        const verify = allCards.findIndex(item => item.elementUrl === card.elementUrl)
        if (verify === -1) {
          allCards.push(card)
        } else {
          allCards[verify].labelName += ' e ' + card.labelName
        }

        return allCards
      }, [])

      if (sample.length) {
        return callback(null, sample)
      } else {
        return callback({ error: 'invalid' })
      }
    })
  }
}


