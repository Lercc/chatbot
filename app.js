'use strict'

const express = require('express'); 
const bodyParser = require('body-parser'); 
const request = require('request'); 

// extendiendo funcionalidad de express
const app = express();

//configurar puerto
app.set('port', 5000);
app.use(bodyParser.json());

//crear ruta principal
app.get('/', function(req, response) {
  response.send("hola mundo!");
});

//
app.get('/webhook', function(req, response) {
  if (req.query['hub.verify_token'] === 'appLercc_token') {
    response.send(req.query['hub.challenge'])
  } else {
    response.send('appLercc: no tienes permisos.')
  }
});

app.listen(app.get('port'), function() {
  console.log('Nuestro servidor esta funcionando correctamente en el puerto: ', app.get('port'))
})