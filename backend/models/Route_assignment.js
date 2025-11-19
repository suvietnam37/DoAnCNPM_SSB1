// models/Route_assignment.js
const db = require("../config/db");

// -------------------------
// Lấy tất cả phân công
// -------------------------
async function getAll() {
  const [rows] = await db.query(
    `
    SELECT  
      ra.assignment_id,
      ra.route_id,
      ra.driver_id,
      ra.bus_id,
      DATE_FORMAT(ra.run_date, '%Y-%m-%d') AS run_date,
      ra.status,
      ra.departure_time,
      ra.is_deleted,
      ra.current_stop_id,
      ra.next_stop_id
    FROM route_assignment ra
    WHERE ra.is_deleted = 0
    ORDER BY ra.assignment_id ASC, ra.run_date DESC, ra.departure_time DESC
    `
  );
  return rows;
}

// -------------------------
// Lấy phân công theo ID
// -------------------------
async function getById(id) {
  const [rows] = await db.query(
    `
    SELECT 
      ra.assignment_id,
      ra.route_id,
      ra.driver_id,
      ra.bus_id,
      DATE_FORMAT(ra.run_date, '%Y-%m-%d') AS run_date,
      ra.status,
      ra.departure_time,
      ra.is_deleted,
      ra.current_stop_id,
      ra.next_stop_id
    FROM route_assignment ra
    WHERE ra.assignment_id = ?
      AND ra.is_deleted = 0
    `,
    [id]
  );

  return rows[0] || null;
}

// -------------------------
// Thêm phân công mới
// -------------------------
async function create(routeAssignment) {
  const { route_id, driver_id, bus_id, run_date, status, departure_time } =
    routeAssignment;

  const [result] = await db.query(
    `
    INSERT INTO route_assignment 
      (route_id, driver_id, bus_id, run_date, status, departure_time) 
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [route_id, driver_id, bus_id, run_date, status, departure_time]
  );

  return { assignment_id: result.insertId, ...routeAssignment };
}

// -------------------------
// Cập nhật phân công
// -------------------------
async function update(id, routeAssignment) {
  const { route_id, driver_id, bus_id, run_date, status, departure_time } =
    routeAssignment;

  const [result] = await db.query(
    `
    UPDATE route_assignment 
    SET route_id = ?, driver_id = ?, bus_id = ?, run_date = ?, 
        status = ?, departure_time = ?
    WHERE assignment_id = ? 
      AND is_deleted = 0
    `,
    [route_id, driver_id, bus_id, run_date, status, departure_time, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route assignment not found or already deleted");
  }

  return { assignment_id: id, ...routeAssignment };
}

// -------------------------
// Xóa mềm
// -------------------------
async function softDelete(id) {
  const [result] = await db.query(
    `
    UPDATE route_assignment 
    SET is_deleted = 1 
    WHERE assignment_id = ? 
      AND is_deleted = 0
    `,
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route assignment not found or already deleted");
  }

  return { message: "Route assignment soft deleted successfully" };
}

// -------------------------
// Lấy tất cả phân công theo driverId
// -------------------------
async function getByDriverId(driverId) {
  const [rows] = await db.query(
    `
    SELECT 
      ra.assignment_id,
      ra.route_id,
      ra.driver_id,
      ra.bus_id,
      DATE_FORMAT(ra.run_date, '%Y-%m-%d') AS run_date,
      ra.status,
      ra.departure_time,
      ra.is_deleted,
      ra.current_stop_id,
      ra.next_stop_id
    FROM route_assignment ra
    WHERE ra.driver_id = ?
      AND ra.is_deleted = 0
    ORDER BY ra.run_date DESC, ra.departure_time DESC
    `,
    [driverId]
  );

  return rows;
}

// -------------------------
// Lấy phân công đang chạy theo driverId
// -------------------------
async function getCurrentByDriverId(driverId) {
  const [rows] = await db.query(
    `
    SELECT 
      ra.assignment_id,
      ra.route_id,
      ra.driver_id,
      ra.bus_id,
      DATE_FORMAT(ra.run_date, '%Y-%m-%d') AS run_date,
      ra.status,
      ra.departure_time,
      ra.current_stop_id,
      ra.next_stop_id,
      r.route_name,
      d.driver_name,
      b.license_plate
    FROM route_assignment ra
    JOIN route r ON ra.route_id = r.route_id AND r.is_deleted = 0
    JOIN driver d ON ra.driver_id = d.driver_id AND d.is_deleted = 0
    JOIN bus b ON ra.bus_id = b.bus_id AND b.is_deleted = 0
    WHERE ra.driver_id = ? AND ra.is_deleted = 0
    ORDER BY ra.departure_time ASC;
      
    `,
    [driverId]
  );

  return rows[0] || null;
}

// -------------------------
// Lấy phân công đang chạy theo routeId
// -------------------------
async function getCurrentByRouteId(routeId) {
  const [rows] = await db.query(
    `
    SELECT 
      ra.assignment_id,
      ra.route_id,
      ra.driver_id,
      ra.bus_id,
      DATE_FORMAT(ra.run_date, '%Y-%m-%d') AS run_date,
      ra.status,
      ra.departure_time,
      ra.current_stop_id,
      ra.next_stop_id,
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
    `,
    [routeId]
  );

  return rows[0] || null;
}

// Lấy số lượng stop theo assignment_id
// -------------------------
async function getStopCountByAssignmentId(assignmentId) {
  const [rows] = await db.query(
    `
    SELECT COUNT(s.stop_id) AS stop_count
    FROM route_assignment ra
    JOIN stop s ON ra.route_id = s.route_id
    WHERE ra.assignment_id = ?
      AND ra.is_deleted = 0
      AND s.is_deleted = 0
    `,
    [assignmentId]
  );

  return rows[0]?.stop_count || 0;
}

async function start(id, status, current_stop_id) {
  const assignment_id = id;
  const newstatus = status;
  const csi = current_stop_id;

  const [result] = await db.query(
    `
    UPDATE route_assignment 
    SET  status = ? , current_stop_id = ?
    WHERE assignment_id = ? 
      AND is_deleted = 0
    `,
    [newstatus, csi, assignment_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route assignment not found or already deleted");
  }

  return { assignment_id: id, status, current_stop_id };
}

async function updateStops(id, current_stop_id, next_stop_id) {
  const [result] = await db.query(
    `
    UPDATE route_assignment 
    SET current_stop_id = ?, next_stop_id = ?
    WHERE assignment_id = ? 
      AND is_deleted = 0
    `,
    [current_stop_id, next_stop_id, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route assignment not found or already deleted");
  }

  return { assignment_id: id, current_stop_id, next_stop_id };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  softDelete,
  start,
  getByDriverId,
  getCurrentByDriverId,
  getCurrentByRouteId,
  getStopCountByAssignmentId,
  updateStops,
};
