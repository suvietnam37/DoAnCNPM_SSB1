// backend/models/Notification.js
const db = require("../config/db");

// Lấy tất cả thông báo của một tài khoản
async function getByAccountId(accountId) {
  const [rows] = await db.query(
    `SELECT * FROM notification 
     WHERE account_id = ? AND is_deleted = 0 
     ORDER BY created_at DESC`,
    [accountId]
  );
  return rows;
}

// Lấy tất cả thông báo (bao gồm đã xóa - dành cho admin)
async function getAll() {
  const [rows] = await db.query(
    `SELECT * FROM notification 
     ORDER BY created_at DESC`
  );
  return rows;
}

// Xóa mềm thông báo
async function softDelete(id) {
  const [result] = await db.query(
    `UPDATE notification 
     SET is_deleted = 1 
     WHERE notification_id = ? AND is_deleted = 0`,
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Notification not found or already deleted");
  }

  return { message: "Notification soft deleted successfully" };
}

// Export
module.exports = {
  getByAccountId,
  getAll,
  softDelete,
};