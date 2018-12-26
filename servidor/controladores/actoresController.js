var connection = require('../lib/conexionbd');

var controllerActores = {

  getActors: function (req, res) {
    
    var sql = "SELECT * FROM actor";

    connection.query(sql, function(error, result) {
      if (error) {
        console.log("ERROR: ", error.message);
        return res.status(404).send(error.message)       
      }

      res.send(JSON.stringify(result));   

    });
  }

}

module.exports = controllerActores
