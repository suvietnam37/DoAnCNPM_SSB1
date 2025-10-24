// models/Bus.js
const db = require("../config/db");

// Lấy tất cả xe buýt
async function getAll() {
  const [rows] = await db.query("SELECT * FROM bus WHERE is_deleted = 0");
  return rows;
}

// Lấy xe buýt theo ID
async function getById(id) {
  const [rows] = await db.query(
    "SELECT * FROM bus WHERE bus_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

// Thêm xe buýt mới
async function create(bus) {
  const { license_plate } = bus;
  // Lưu ý: bảng `bus` chỉ có `license_plate`, không có `capacity`
  const [result] = await db.query(
    "INSERT INTO bus (license_plate) VALUES (?)",
    [license_plate]
  );
  return { bus_id: result.insertId, license_plate };
}

// Cập nhật xe buýt
async function update(id, bus) {
  const { license_plate } = bus;
  const [result] = await db.query(
    "UPDATE bus SET license_plate = ? WHERE bus_id = ? AND is_deleted = 0",
    [license_plate, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Bus not found or already deleted");
  }

  return { bus_id: id, license_plate };
}

// Xóa mềm (soft delete)
async function softDelete(id) {
  const [result] = await db.query(
    "UPDATE bus SET is_deleted = 1 WHERE bus_id = ? AND is_deleted = 0",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Bus not found or already deleted");
  }

  return { message: "Bus soft deleted successfully" };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  softDelete,
};