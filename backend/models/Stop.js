// models/Stop.js
const db = require("../config/db");

// Lấy tất cả stop
async function getAll() {
  const [rows] = await db.query("SELECT * FROM stop");
  return rows;
}

// Lấy stop theo ID
async function getById(id) {
  const [rows] = await db.query("SELECT * FROM stop WHERE stop_id = ?", [id]);
  return rows[0];
}

// Thêm stop mới
async function create(stop) {
  const { route_id, stop_name } = stop; // Assuming fields from truncated SQL, adjust if more fields exist
  const [result] = await db.query(
    "INSERT INTO stop (route_id, stop_name) VALUES (?, ?)",
    [route_id, stop_name]
  );
  return { id: result.insertId, ...stop };
}

// Cập nhật stop
async function update(id, stop) {
  const { route_id, stop_name } = stop; // Assuming fields from truncated SQL, adjust if more fields exist
  await db.query(
    "UPDATE stop SET route_id = ?, stop_name = ? WHERE stop_id = ?",
    [route_id, stop_name, id]
  );
  return { id, ...stop };
}

// Xóa stop
async function remove(id) {
  await db.query("DELETE FROM stop WHERE stop_id = ?", [id]);
  return { message: "Stop deleted successfully" };
}

module.exports = { getAll, getById, create, update, remove };