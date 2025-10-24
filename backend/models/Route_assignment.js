// models/Route_assignment.js
const db = require("../config/db");

// Lấy tất cả phân công
async function getAll() {
  const [rows] = await db.query(
    "SELECT * FROM route_assignment WHERE is_deleted = 0 ORDER BY run_date DESC, departure_time DESC"
  );
  return rows;
}

// Lấy phân công theo ID
async function getById(id) {
  const [rows] = await db.query(
    "SELECT * FROM route_assignment WHERE assignment_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

// Thêm phân công mới
async function create(routeAssignment) {
  const { route_id, driver_id, bus_id, run_date, status, departure_time } = routeAssignment;
  const [result] = await db.query(
    `INSERT INTO route_assignment 
     (route_id, driver_id, bus_id, run_date, status, departure_time) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [route_id, driver_id, bus_id, run_date, status, departure_time]
  );
  return { assignment_id: result.insertId, ...routeAssignment };
}

// Cập nhật phân công
async function update(id, routeAssignment) {
  const { route_id, driver_id, bus_id, run_date, status, departure_time } = routeAssignment;
  const [result] = await db.query(
    `UPDATE route_assignment 
     SET route_id = ?, driver_id = ?, bus_id = ?, run_date = ?, status = ?, departure_time = ? 
     WHERE assignment_id = ? AND is_deleted = 0`,
    [route_id, driver_id, bus_id, run_date, status, departure_time, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route assignment not found or already deleted");
  }

  return { assignment_id: id, ...routeAssignment };
}

// Xóa mềm (soft delete)
async function softDelete(id) {
  const [result] = await db.query(
    "UPDATE route_assignment SET is_deleted = 1 WHERE assignment_id = ? AND is_deleted = 0",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route assignment not found or already deleted");
  }

  return { message: "Route assignment soft deleted successfully" };
}

// Lấy tất cả phân công của một tài xế
async function getByDriverId(driverId) {
  const [rows] = await db.query(
    `SELECT ra.* 
     FROM route_assignment ra
     WHERE ra.driver_id = ? AND ra.is_deleted = 0
     ORDER BY ra.run_date DESC, ra.departure_time DESC`,
    [driverId]
  );
  return rows;
}

// Lấy phân công ĐANG CHẠY của một tài xế (chỉ 1 hoặc 0)
async function getCurrentByDriverId(driverId) {
  const [rows] = await db.query(`
    SELECT 
        ra.*, 
        r.route_name, 
        d.driver_name, 
        b.license_plate
    FROM route_assignment ra
    JOIN route r ON ra.route_id = r.route_id AND r.is_deleted = 0
    JOIN driver d ON ra.driver_id = d.driver_id AND d.is_deleted = 0
    JOIN bus b ON ra.bus_id = b.bus_id AND b.is_deleted = 0
    WHERE ra.driver_id = ? 
      AND ra.status = 'Running' 
      AND ra.is_deleted = 0
  `, [driverId]);
  return rows[0] || null;
}

// Lấy phân công ĐANG CHẠY của một tuyến (chỉ 1 hoặc 0)
async function getCurrentByRouteId(routeId) {
  const [rows] = await db.query(`
    SELECT 
        ra.*, 
        r.route_name, 
        d.driver_name, 
        b.license_plate
    FROM route_assignment ra
    JOIN route r ON ra.route_id = r.route_id AND r.is_deleted = 0
    JOIN driver d ON ra.driver_id = d.driver_id AND d.is_deleted = 0
    JOIN bus b ON ra.bus_id = b.bus_id AND b.is_deleted = 0
    WHERE ra.route_id = ? 
      AND ra.status = 'Running' 
      AND ra.is_deleted = 0
  `, [routeId]);
  return rows[0] || null;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  softDelete,
  getByDriverId,
  getCurrentByDriverId,
  getCurrentByRouteId,
};