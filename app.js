'use strict'

const express = require('express'); 
const bodyParser = require('body-parser'); 
const request = require('request'); 

const ACCESS_TOKEN = "EAAnots4vao4BAFKndIOFtwihZA9efky6G1TkAMz9sC5HZArDpORWqlySVmVL8QJQzDZB4VP3sV0NeZBHxTQRHcS5RyXXGvLZAPVdgy3nLZBmLUXYPLNAKpEAXrwFAfesf7vxLqLs4VJeLq4ul9jUvVfJLSsGID6b1d53gL6PbZACAZDZD"

// extendiendo funcionalidad de express
const app = express();

//configurar puerto
app.set('port', 5000);
app.use(bodyParser.json());

//crear ruta principal
app.get('/', function(req, response) {
  response.send("hola mundo!");
});

//prueba que la ruta webhook esta funcionando
app.get('/webhook', function(req, response) {
  if (req.query['hub.verify_token'] === 'appLercc_token') {
    response.send(req.query['hub.challenge'])
  } else {
    response.send('appLercc: no tienes permisos.')
  }
});

// ***********************************************
/**
 * Lógica de la app 
*/
// ***********************************************

// Función para recoger los mensajes que llegan al webhook.
app.post('/webhook/', function(req,res) {
  const webhook_event = req.body.entry[0];
  if (webhook_event.messaging) {
    webhook_event.messaging.forEach( event => {
      handleMessage(event)
    })
  }
  res.sendStatus(200);
})

// Función (manejador) de envio/respuesta a mensajes
function handleMessage(event) {
  const SENDER_ID = event.sender.id
  const MESSAGE_TEXT = event.message.text

  const MESSAGE_DATA = {
    recipient: {
      id: SENDER_ID
    },
    message: {
      text: MESSAGE_TEXT
    }
  }
  // llamada a envio a la API de FB MSG
  callSendApi(MESSAGE_DATA)
}

//función para envio de mensajes por la API de FB
function callSendApi(msg_res) {
  request({
    "url": "https://graph.facebook.com/me/messages/",
    "qs": {
      "access_token": ACCESS_TOKEN
    },
    "method": "POST",
    "json": msg_res
  },function(status) {
    if (status) {
      console.log('Ha ocurrido un error')
    } else {
      console.log('Mensaje enviado!')
    }
  })
}






















// prueba de que el servidor con express esta funcionando 
app.listen(app.get('port'), function() {
  console.log('Nuestro servidor esta funcionando correctamente en el puerto: ', app.get('port'))
})