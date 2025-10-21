// models/Route.js
const db = require("../config/db");

// Lấy tất cả route
async function getAll() {
  const [rows] = await db.query("SELECT * FROM route");
  return rows;
}

// Lấy route theo ID
async function getById(id) {
  const [rows] = await db.query("SELECT * FROM route WHERE route_id = ?", [id]);
  return rows[0];
}

// Thêm route mới
async function create(route) {
  const { route_name } = route;
  const [result] = await db.query(
    "INSERT INTO route (route_name) VALUES (?)",
    [route_name]
  );
  return { id: result.insertId, ...route };
}

// Cập nhật route
async function update(id, route) {
  const { route_name } = route;
  await db.query(
    "UPDATE route SET route_name = ? WHERE route_id = ?",
    [route_name, id]
  );
  return { id, ...route };
}

// Xóa route
async function remove(id) {
  await db.query("DELETE FROM route WHERE route_id = ?", [id]);
  return { message: "Route deleted successfully" };
}

module.exports = { getAll, getById, create, update, remove };