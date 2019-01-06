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

  getComp: function (req, res) {
    
    var sql = `
    SELECT c.nombre as nombre, g.nombre as genero, d.nombre as director, a.nombre as actor FROM competencia c
    LEFT JOIN genero g ON c.genero_id = g.id
    LEFT JOIN director d ON c.director_id = d.id
    LEFT JOIN actor a ON c.actor_id = a.id
    WHERE c.id = ?`;

    connection.query(sql, [req.params.id], function(error, result) {
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      var response = {
        'nombre': result[0].nombre,
        'genero_nombre': result[0].genero,
        'actor_nombre': result[0].actor,
        'director_nombre': result[0].director
      };
      
      res.send(JSON.stringify(response));
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
      
      var competencia = result[0];
      var sqlPeliculas = `SELECT p.id, p.titulo, p.poster FROM pelicula p`;
      var join = ``;
      var filter = ` WHERE `;

      if (competencia.genero_id) {
        filter += `p.genero_id = ${competencia.genero_id}`
      }
      
      if (competencia.director_id) {
        if (competencia.genero_id) {
          filter += ` AND `
        }
        join += ` INNER JOIN director_pelicula d ON p.id = d.pelicula_id`
        filter += `d.director_id = ${competencia.director_id}`
      }

      if (competencia.actor_id) {
        if (competencia.genero_id || competencia.director_id) {
          filter += ` AND `
        }
        join += ` INNER JOIN actor_pelicula a ON p.id = a.pelicula_id`
        filter += `a.actor_id = ${competencia.actor_id}`
      }

      if (join != ``) {
        sqlPeliculas += join;
      }

      if (filter != ` WHERE `) {
        sqlPeliculas += filter;
      }

      sqlPeliculas += ` ORDER BY rand() LIMIT 2`;

      connection.query(sqlPeliculas, function (error, result){
        if (error) {
          console.log("ERROR: ", error.message);
          return res.status(404).send(error.message)       
        }
        
        var response = {
          'competencia': competencia.nombre,
          'peliculas': result
        };
    
        res.send(JSON.stringify(response));
        
      });
    });
  },

  addVote: function (req, res) {

    var sql = 'INSERT INTO votos (pelicula_id, competencia_id ) VALUES (?, ?)';
    console.log(req.body.idPelicula, req.params.id);

    connection.query(sql, [parseInt(req.body.idPelicula), parseInt(req.params.id)], function(error, result) {
      
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      res.status(200).send();
    });
  },

  getResults: function (req, res) {

    var sql = `
    SELECT COUNT(pelicula_id) as votos, pelicula_id, competencia.nombre as competencia, pelicula.poster, pelicula.titulo 
    FROM votos 
    JOIN competencia ON votos.competencia_id = competencia.id
    JOIN pelicula ON votos.pelicula_id = pelicula.id
    WHERE competencia_id = ? 
    GROUP BY pelicula_id 
    ORDER BY votos DESC LIMIT 3`;

    connection.query(sql, [parseInt(req.params.id)], function(error, result) {
      
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      var response = {
        resultados: result
      }
  
      res.send(JSON.stringify(response));
    });
  },

  newComp: function (req, res) {
    
    var sql = 'SELECT * FROM competencia WHERE nombre = ?';

    connection.query(sql, [req.body.nombre], function(error, result) {
      
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      if (result.length > 0) {
        console.log("ERROR: ", 'Competencia existente');
        return res.status(422).send('LA COMPETENCIA YA EXISTE')
      }

      var columns = 'nombre';
      var valColumns = '?';
      var arrColumns = [req.body.nombre];

      if (req.body.genero && req.body.genero != 0) {
        columns += ', genero_id';
        valColumns += ', ?';
        arrColumns.push(req.body.genero)
      }

      if (req.body.director && req.body.director != 0) {
        columns += ', director_id';
        valColumns += ', ?';
        arrColumns.push(req.body.director)
      }

      if (req.body.actor && req.body.actor != 0) {
        columns += ', actor_id';
        valColumns += ', ?';
        arrColumns.push(req.body.actor)
      }

      var sqlNew = `INSERT INTO competencia(${columns}) VALUES (${valColumns})`;
      
      connection.query(sqlNew, arrColumns, function(error, result) {
      
        if (error) {
          console.log("ERROR: ", error.message);
          return res.status(404).send(error.message)       
        }

        res.status(200).send();
      });
    });
  },

  restart: function (req, res) {
    
    var sql = 'SELECT * FROM votos WHERE competencia_id = ?';

    connection.query(sql, [req.params.id], function(error, result) {
      
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      if (result.length == 0) {
        console.log("ERROR: ", 'Competencia inexistente o sin votos');
        return res.status(404).send('LA COMPETENCIA AUN NO TIENE VOTOS')
      }

      var sqlDelete = 'DELETE FROM votos WHERE competencia_id = ?';

      connection.query(sqlDelete, [req.params.id], function(error, result) {
      
        if (error) {
          console.log("ERROR: ", error.message);
          return res.status(404).send(error.message)       
        }

        res.status(200).send();
      });
    });
  },

  editComp: function (req, res) {
    
    var sql = 'UPDATE competencia SET nombre = ? WHERE id = ?';
    
    connection.query(sql, [req.body.nombre, req.params.id], function(error, result) {
      
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }
      
      res.status(200).send();   
    });
  },

  deleteComp: function (req, res) {
    
    var sql = 'DELETE FROM votos WHERE competencia_id = ?';

    connection.query(sql, [req.params.id], function(error, result) {
      
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      var sqlDelete = 'DELETE FROM competencia WHERE id = ?';

      connection.query(sqlDelete, [req.params.id], function(error, result) {
      
        if (error) {
          console.log("ERROR: ", error.message);
          return res.status(404).send(error.message)       
        }

        res.status(200).send();
      });      
    });
  }
}

module.exports = controller
