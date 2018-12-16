var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var competenciasController = require('./controladores/competenciasController');

var app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/competencias', competenciasController.listAll);
app.get('/competencias/:id/peliculas', competenciasController.getOptions);
app.post('/competencias/:id/voto', competenciasController.addVote);

var puerto = '8080';

app.listen(puerto, function(){
  console.log('Escuchando en el puerto ' + puerto );
})
