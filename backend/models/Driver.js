// models/Driver.js
const db = require("../config/db");

// Lấy tất cả driver
async function getAll() {
  const [rows] = await db.query("SELECT * FROM driver");
  return rows;
}

// Lấy driver theo ID
async function getById(id) {
  const [rows] = await db.query("SELECT * FROM driver WHERE driver_id = ?", [
    id,
  ]);
  return rows[0];
}

async function getByAccId(id) {
  const [rows] = await db.query("SELECT * FROM driver WHERE account_id = ?", [
    id,
  ]);
  return rows[0];
}
// Thêm driver mới
async function create(driver) {
  const { driver_name, account_id } = driver;
  const [result] = await db.query(
    "INSERT INTO driver (driver_name, account_id) VALUES (?, ?)",
    [driver_name, account_id]
  );
  return { id: result.insertId, ...driver };
}

// Cập nhật driver
async function update(id, driver) {
  const { driver_name, account_id } = driver;
  await db.query(
    "UPDATE driver SET driver_name = ?, account_id = ? WHERE driver_id = ?",
    [driver_name, account_id, id]
  );
  return { id, ...driver };
}

// Xóa driver
async function remove(id) {
  await db.query("DELETE FROM driver WHERE driver_id = ?", [id]);
  return { message: "Driver deleted successfully" };
}

async function assignAccount(driver_id, account_id) {
  const [result] = await db.query(
    `UPDATE driver SET account_id = ? WHERE driver_id = ?`,
    [account_id, driver_id]
  );
  return result.affectedRows;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  assignAccount,
  getByAccId,
};
