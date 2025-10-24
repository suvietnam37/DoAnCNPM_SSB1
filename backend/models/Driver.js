// models/Driver.js
const db = require("../config/db");

// Lấy tất cả driver
async function getAll() {
  const [rows] = await db.query("SELECT * FROM driver WHERE is_deleted = 0");
  return rows;
}

// Lấy driver theo ID
async function getById(id) {
  const [rows] = await db.query(
    "SELECT * FROM driver WHERE driver_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

// Lấy driver theo account_id
async function getByAccId(id) {
  const [rows] = await db.query(
    "SELECT * FROM driver WHERE account_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

// Thêm driver mới
async function create(driver) {
  const { driver_name, account_id } = driver;
  const [result] = await db.query(
    "INSERT INTO driver (driver_name, account_id) VALUES (?, ?)",
    [driver_name, account_id]
  );
  return {
    driver_id: result.insertId,
    driver_name,
    account_id,
  };
}

// Cập nhật driver
async function update(id, driver) {
  const { driver_name, account_id } = driver;
  const [result] = await db.query(
    "UPDATE driver SET driver_name = ?, account_id = ? WHERE driver_id = ? AND is_deleted = 0",
    [driver_name, account_id, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Driver not found or already deleted");
  }

  return { driver_id: id, driver_name, account_id };
}

// Xóa mềm driver
async function softDelete(id) {
  const [result] = await db.query(
    "UPDATE driver SET is_deleted = 1 WHERE driver_id = ? AND is_deleted = 0",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Driver not found or already deleted");
  }

  return { message: "Driver soft deleted successfully" };
}

// Gán account cho driver
async function assignAccount(driver_id, account_id) {
  const [result] = await db.query(
    `UPDATE driver 
     SET account_id = ? 
     WHERE driver_id = ? AND is_deleted = 0`,
    [account_id, driver_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Driver not found or already deleted");
  }

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