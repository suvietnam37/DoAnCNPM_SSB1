// models/Parent.js
const db = require("../config/db");

// Lấy tất cả parent
async function getAll() {
  const [rows] = await db.query("SELECT * FROM parent");
  return rows;
}

// Lấy parent theo ID
async function getById(id) {
  const [rows] = await db.query("SELECT * FROM parent WHERE parent_id = ?", [id]);
  return rows[0];
}

// Thêm parent mới
async function create(parent) {
  const { parent_name, phone, email, account_id } = parent;
  const [result] = await db.query(
    "INSERT INTO parent (parent_name, phone, email, account_id) VALUES (?, ?, ?, ?)",
    [parent_name, phone, email, account_id]
  );
  return { id: result.insertId, ...parent };
}

// Cập nhật parent
async function update(id, parent) {
  const { parent_name, phone, email, account_id } = parent;
  await db.query(
    "UPDATE parent SET parent_name = ?, phone = ?, email = ?, account_id = ? WHERE parent_id = ?",
    [parent_name, phone, email, account_id, id]
  );
  return { id, ...parent };
}

// Xóa parent
async function remove(id) {
  await db.query("DELETE FROM parent WHERE parent_id = ?", [id]);
  return { message: "Parent deleted successfully" };
}

module.exports = { getAll, getById, create, update, remove };