var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var controller = require('./controladores/competenciasController');

var app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/competencias', controller.listAll);

var puerto = '8080';

app.listen(puerto, function(){
  console.log('Escuchando en el puerto ' + puerto );
})
