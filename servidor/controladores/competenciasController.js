var connection = require('../lib/conexionbd');

function listAll (req, res) {
  var sql = 'SELECT * FROM competencia';
  connection.query(sql, function(error, result) {
    if (error) {
      console.log("ERROR: ", error.message);
      return res.status(404).send(error.message)       
    }

    // var response = result

    res.send(JSON.stringify(result));   
  });
}

module.exports = {
  listAll: listAll
}
