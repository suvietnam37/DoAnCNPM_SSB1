// models/Parent.js
const db = require("../config/db");

// Lấy tất cả phụ huynh
async function getAll() {
  const [rows] = await db.query("SELECT * FROM parent WHERE is_deleted = 0");
  return rows;
}

// Lấy phụ huynh theo ID
async function getById(id) {
  const [rows] = await db.query(
    "SELECT * FROM parent WHERE parent_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

// Lấy phụ huynh theo account_id
async function getByAccId(id) {
  const [rows] = await db.query(
    "SELECT * FROM parent WHERE account_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

// Thêm phụ huynh mới
async function create(parent) {
  const { parent_name, phone, email, account_id } = parent;
  const [result] = await db.query(
    "INSERT INTO parent (parent_name, phone, email, account_id) VALUES (?, ?, ?, ?)",
    [parent_name, phone, email, account_id]
  );
  return { parent_id: result.insertId, parent_name, phone, email, account_id };
}

// Cập nhật phụ huynh
async function update(id, parent) {
  const { parent_name, phone, email, account_id } = parent;
  const [result] = await db.query(
    "UPDATE parent SET parent_name = ?, phone = ?, email = ?, account_id = ? WHERE parent_id = ? AND is_deleted = 0",
    [parent_name, phone, email, account_id, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Parent not found or already deleted");
  }

  return { parent_id: id, parent_name, phone, email, account_id };
}

// Xóa mềm (soft delete)
async function softDelete(id) {
  const [result] = await db.query(
    "UPDATE parent SET is_deleted = 1 WHERE parent_id = ? AND is_deleted = 0",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Parent not found or already deleted");
  }

  return { message: "Parent soft deleted successfully" };
}

// Gán tài khoản cho phụ huynh
async function assignAccount(parent_id, account_id) {
  const [result] = await db.query(
    "UPDATE parent SET account_id = ? WHERE parent_id = ? AND is_deleted = 0",
    [account_id, parent_id]
  );
  return result.affectedRows;
}

module.exports = {
  getAll,
  getById,
  getByAccId,
  create,
  update,
  softDelete,
  assignAccount,
};