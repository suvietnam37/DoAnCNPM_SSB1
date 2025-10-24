// models/Route.js
const db = require("../config/db");

// Lấy tất cả tuyến đường
async function getAll() {
  const [rows] = await db.query(
    "SELECT * FROM route WHERE is_deleted = 0 ORDER BY route_name ASC"
  );
  return rows;
}

// Lấy tuyến đường theo ID
async function getById(id) {
  const [rows] = await db.query(
    "SELECT * FROM route WHERE route_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

// Thêm tuyến đường mới
async function create(route) {
  const { route_name } = route;
  const [result] = await db.query(
    "INSERT INTO route (route_name) VALUES (?)",
    [route_name]
  );
  return { route_id: result.insertId, route_name };
}

// Cập nhật tuyến đường
async function update(id, route) {
  const { route_name } = route;
  const [result] = await db.query(
    "UPDATE route SET route_name = ? WHERE route_id = ? AND is_deleted = 0",
    [route_name, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route not found or already deleted");
  }

  return { route_id: id, route_name };
}

// Xóa mềm tuyến đường
async function softDelete(id) {
  const [result] = await db.query(
    "UPDATE route SET is_deleted = 1 WHERE route_id = ? AND is_deleted = 0",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route not found or already deleted");
  }

  return { message: "Route soft deleted successfully" };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  softDelete,
};