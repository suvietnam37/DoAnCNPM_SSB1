const { getAll } = require("../../models/Driver.js");

exports.getAllDrivers = async (req, res) => {
  let results = await getAll();
  res.json(results);
};
