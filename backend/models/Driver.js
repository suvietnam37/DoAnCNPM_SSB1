const connection = require("../config/db");

const getAll = async () => {
  let [results, fields] = await connection.query("select * from driver");
  return results;
};

module.exports = { getAll };
