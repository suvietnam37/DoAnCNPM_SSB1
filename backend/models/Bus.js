// models/Bus.js
const db = require("../config/db");

// Lấy tất cả xe bus
async function getAll() {
  const [rows] = await db.query("SELECT * FROM bus");
  return rows;
}

// Lấy bus theo ID
async function getById(id) {
  const [rows] = await db.query("SELECT * FROM bus WHERE bus_id = ?", [id]);
  return rows[0];
}

// Thêm bus mới
async function create(bus) {
  const { license_plate, capacity } = bus;
  const [result] = await db.query(
    "INSERT INTO bus (license_plate) VALUES (?)",
    [license_plate, capacity]
  );
  return { id: result.insertId, ...bus };
}

// Cập nhật bus
async function update(id, bus) {
  const { license_plate, capacity } = bus;
  await db.query(
    "UPDATE bus SET license_plate = ? WHERE bus_id = ?",
    [license_plate, id]
  );
  return { id, ...bus };
}

// Xóa bus
async function remove(id) {
  await db.query("DELETE FROM bus WHERE bus_id = ?", [id]);
  return { message: "Bus deleted successfully" };
}

module.exports = { getAll, getById, create, update, remove };
