

const trelloLogin = document.querySelector('#trelloLogin')

const authenticationSuccess = () => {
  $('form').append('<input type="hidden" name="tokenTrello" value="' + Trello.token() + '" />')
  $('form').append('<input type="hidden" name="keyTrello" value="' + Trello.key() + '" />')
  $('form').show()
  const authTrello = { "tokenTrello": Trello.token(), "keyTrello": Trello.key() }
  $.ajax({
    method: 'POST',
    url: '/board',
    data: authTrello,
    success: (data) => {
      $('form').append('<label for="idBoard"> Selecione o quadro desejado </label>')
      let sel = $('<select>').appendTo('form').attr('name', 'idBoard').attr('id', 'idBoard').attr('class', 'form-control')
      sel.append($("<option>").attr('selected', "selected"))
      data.forEach((value) => {
        sel.append($("<option>").attr('id', value.id).text(value.name).attr('value', value.id))
      })
      $('#labelTrelloLogin').hide()
      $("#idBoard").change(function () {
        let id = $(this).children(":selected").attr("id")
        $.ajax({
          method: 'POST',
          url: '/board/lists',
          data: { "tokenTrello": Trello.token(), "keyTrello": Trello.key(), "boardID": id },
          success: (data) => {
            $('#idBoard').attr('disabled', true)
            $('form').append('<label for="listName"> Selecione a coluna desejada </label>')
            let sel = $('<select>').appendTo('form').attr('name', 'listName').attr('id', 'listId').attr('class', 'form-control')
            sel.append($("<option>").attr('selected', "selected"))
            data.forEach((value) => {
              sel.append($("<option>").attr('id', value.listName).text(value.listName).attr('value', value.listId))
            })

            $("#listId").change(function () {
              let id = $(this).children(":selected").attr("value")
              let listNameDOM = $(this).children(":selected").attr("id")
              $.ajax({
                method: 'POST',
                url: '/board/lists/labels',
                data: { "tokenTrello": Trello.token(), "keyTrello": Trello.key(), "listId": id, "listName": listNameDOM },
                success: (data) => {
                  $('form').append('<input type="hidden" name="listName" value="' + document.querySelector('#listId').value + '" />')
                  $('#listId').attr('disabled', true)
                  $('form').append('<div class="form-inline">')
                  $('.form-inline').append('<label for="listLabels"> Selecione as etiquetas desejadas </label>')
                  let sel = $('<select>').appendTo('.form-inline').attr('name', 'registredLabels').attr('id', 'labelName').attr('class', 'form-control')
                  sel.append($("<option>").attr('selected', "selected"))
                  $('#labelName').after($('<input type="button" class="btn btn-primary" id="insertLabel" value="+">'))
                  data.forEach((value) => {
                    sel.append($("<option>").attr('id', value.id).text(value.name).attr('value', value.name))
                  })
                  let contador = 0
                  const insertLabel = document.querySelector('#insertLabel')
                  $('form').append('<div id="registredLabels" class="col-md-4">')
                  $('#registredLabels').append('<p class="font-bold">Etiquetas Cadastradas:</p>')
                  $('form').append('<div id="logLabels" class="col-md-12">')
                  $('#logLabels').append('<button type="submit" class="btn btn-success btn-block" id="submit" >Baixar CSV</button>')
                  $('#registredLabels').append('<ol id="labelList"></ol>')
                  insertLabel.addEventListener('click', (e) => {
                    let labelValue = document.querySelector('#labelName').value
                    $('#labelName').val('')
                    $('#registredLabels').append("<li>" + labelValue + "</li>")
                    $('form').append('<input type="hidden" name="registredLabels[' + contador + ']" value="' + labelValue + '" />')
                    labelValue = ''
                    contador++
                  })
                },
                error: (data) => {
                  $('form').append('<div class="alert alert-danger alertson"> Poxa, a lista <strong>' + listNameDOM + '</strong> não tem labels :(</div>')
                  $('.alertson').fadeOut( 7000, () => {
                    
                  })
                }
              }
              )
            })
          }
        })
      })
    }
  })

}
const authenticationFailure = () => { console.log('Failed authentication') }
trelloLogin.addEventListener('click', (e) => {
  e.preventDefault()
  Trello.authorize({
    type: 'popup',
    name: 'Trello CSV Generator',
    scope: {
      read: 'true',
      write: 'false'
    },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  })
})