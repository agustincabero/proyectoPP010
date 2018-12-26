var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var competenciasController = require('./controladores/competenciasController');
var generosController = require('./controladores/generosController');
var directoresController = require('./controladores/directoresController');
var actoresController = require('./controladores/actoresController');

var app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/competencias', competenciasController.listAll);
app.get('/competencias/:id', competenciasController.getComp);
app.get('/competencias/:id/peliculas', competenciasController.getOptions);
app.post('/competencias/:id/voto', competenciasController.addVote);
app.get('/competencias/:id/resultados', competenciasController.getResults);
app.post('/competencias', competenciasController.newComp);
app.delete('/competencias/:id/votos', competenciasController.restart);
app.get('/generos', generosController.getGenres);
app.get('/directores', directoresController.getDirectors);
app.get('/actores', actoresController.getActors);


var puerto = '8080';

app.listen(puerto, function(){
  console.log('Escuchando en el puerto ' + puerto );
})
