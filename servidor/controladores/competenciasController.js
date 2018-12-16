var connection = require('../lib/conexionbd');

var controller = {

  listAll: function (req, res) {
    
    var sql = 'SELECT * FROM competencia';

    connection.query(sql, function(error, result) {
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      res.send(JSON.stringify(result));   

    });
  },

  getOptions: function (req, res) {
    
    var idOpt = req.params.id; 
    var sql = `SELECT * FROM competencia WHERE id = ${idOpt}`;
    
    connection.query(sql, function (error, result) {
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }     

      if (result.length === 0) {
        console.log("No se encontro ninguna competencia con este id");
        return res.status(404).send("No se encontro ninguna competencia con este id");
      }
      
      var competencia = result[0].nombre;
      var sqlPeliculas = `SELECT pelicula.id, pelicula.poster, pelicula.titulo FROM pelicula LIMIT 2`;

      connection.query(sqlPeliculas, function (error, result){
        if (error) {
          console.log("ERROR: ", error.message);
          return res.status(404).send(error.message)       
        }

        var peliculas = result;
        
        var response = {
          'competencia': competencia,
          'peliculas': peliculas
        };
    
        res.send(JSON.stringify(response));
        
      });
    });
  },

  addVote: function (req, res) {

    var sql = 'INSERT INTO votos (pelicula_id, competencia_id ) VALUES (?, ?)';
    console.log(req.body.idPelicula, req.params.id);

    connection.query(sql, [parseInt(req.body.idPelicula), parseInt(req.params.id)], function(error, result) {
      console.log(result);
      console.log(error);

      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }
      console.log('assadsad');
      res.status(200).send();
      console.log('assadsad');  

    });
  }
}

module.exports = controller
