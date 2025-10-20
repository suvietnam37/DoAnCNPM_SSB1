const { getAll } = require("../../models/Stop.js");

exports.getAllStops = async (req, res) => {
  let results = await getAll();
  res.json(results);
};
