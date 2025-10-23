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

// Lấy tất cả các phân công của một tài xế
async function getByDriverId(driverId) {
    const [rows] = await db.query("SELECT * FROM route_assignment WHERE driver_id = ?", [driverId]);
    return rows;
}

// Lấy phân công ĐANG CHẠY của một tài xế (chỉ có 1 hoặc 0). Chúng ta join các bảng để lấy tên thay vì chỉ ID, rất tiện cho frontend
async function getCurrentByDriverId(driverId) {
    const [rows] = await db.query(`
        SELECT 
            ra.*, 
            r.route_name, 
            d.driver_name, 
            b.license_plate
        FROM route_assignment ra
        JOIN route r ON ra.route_id = r.route_id
        JOIN driver d ON ra.driver_id = d.driver_id
        JOIN bus b ON ra.bus_id = b.bus_id
        WHERE ra.driver_id = ? AND ra.status = 'Running'
    `, [driverId]);
    return rows[0]; // Chỉ trả về 1 object, vì mỗi lúc chỉ chạy 1 tuyến
}

// Lấy phân công ĐANG CHẠY của một tuyến (chỉ có 1 hoặc 0). Chúng ta join các bảng để lấy tên thay vì chỉ ID, rất tiện cho frontend
async function getCurrentByRouteId(routeId) {
    const [rows] = await db.query(`
        SELECT 
            ra.*, 
            r.route_name, 
            d.driver_name, 
            b.license_plate
        FROM route_assignment ra
        JOIN route r ON ra.route_id = r.route_id
        JOIN driver d ON ra.driver_id = d.driver_id
        JOIN bus b ON ra.bus_id = b.bus_id
        WHERE ra.route_id = ? AND ra.status = 'Running'
    `, [routeId]);
    return rows[0];
}

module.exports = { getAll, getById, create, update, remove, getByDriverId, getCurrentByDriverId, getCurrentByRouteId };