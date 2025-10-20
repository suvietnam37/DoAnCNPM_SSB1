const { getAll } = require("../../models/Parent.js");

// Lấy toàn bộ danh sách học sinh
exports.getAllParents = async (req, res) => {
  let results = await getAll();
  res.json(results);
};
