const { getAll } = require("../../models/Route.js");

exports.getAllRoutes = async (req, res) => {
  let results = await getAll();
  res.json(results);
};
