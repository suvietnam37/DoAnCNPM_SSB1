// models/Route_assignment.js
const db = require("../config/db");

// Lấy tất cả route assignment
async function getAll() {
  const [rows] = await db.query("SELECT * FROM route_assignment");
  return rows;
}

// Lấy route assignment theo ID
async function getById(id) {
  const [rows] = await db.query("SELECT * FROM route_assignment WHERE assignment_id = ?", [id]);
  return rows[0];
}

// Thêm route assignment mới
async function create(routeAssignment) {
  const { route_id, driver_id, bus_id, run_date, status, departure_time } = routeAssignment;
  const [result] = await db.query(
    "INSERT INTO route_assignment (route_id, driver_id, bus_id, run_date, status, departure_time) VALUES (?, ?, ?, ?, ?, ?)",
    [route_id, driver_id, bus_id, run_date, status, departure_time]
  );
  return { id: result.insertId, ...routeAssignment };
}

// Cập nhật route assignment
async function update(id, routeAssignment) {
  const { route_id, driver_id, bus_id, run_date, status, departure_time } = routeAssignment;
  await db.query(
    "UPDATE route_assignment SET route_id = ?, driver_id = ?, bus_id = ?, run_date = ?, status = ?, departure_time = ? WHERE assignment_id = ?",
    [route_id, driver_id, bus_id, run_date, status, departure_time, id]
  );
  return { id, ...routeAssignment };
}

// Xóa route assignment
async function remove(id) {
  await db.query("DELETE FROM route_assignment WHERE assignment_id = ?", [id]);
  return { message: "Route assignment deleted successfully" };
}

module.exports = { getAll, getById, create, update, remove };