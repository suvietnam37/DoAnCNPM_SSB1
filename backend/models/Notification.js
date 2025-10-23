// backend/models/Notification.js
const db = require("../config/db");

// Lấy thông báo theo account_id
async function getByAccountId(accountId) {
  const [rows] = await db.query(
    "SELECT * FROM notification WHERE account_id = ? ORDER BY created_at DESC",
    [accountId]
  );
  return rows;
}

module.exports = { getByAccountId };