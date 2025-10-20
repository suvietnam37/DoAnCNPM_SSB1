const { getAll } = require("../../models/Route_assignment.js");

exports.getAllRoutes = async (req, res) => {
  let results = await getAll();
  res.json(results);
};
