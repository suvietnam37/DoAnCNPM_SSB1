const connection = require("../config/db");

const getAll = async () => {
  let [results, fields] = await connection.query("select * from route");
  return results;
};

module.exports = { getAll };
