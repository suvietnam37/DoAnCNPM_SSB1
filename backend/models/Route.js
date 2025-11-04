// models/Route.js
const db = require("../config/db");

// Lấy tất cả tuyến đường
async function getAll() {
  const [rows] = await db.query(
    "SELECT * FROM route WHERE is_deleted = 0 ORDER BY route_name ASC"
  );
  return rows;
}

// Lấy tuyến đường theo ID
async function getById(id) {
  const [rows] = await db.query(
    "SELECT * FROM route WHERE route_id = ? AND is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

async function getByStopId(id) {
  const [rows] = await db.query(
    "SELECT * FROM route r JOIN stop s ON r.route_id = s.route_id WHERE s.stop_id = ? AND r.is_deleted = 0",
    [id]
  );
  return rows[0] || null;
}

async function getByDateStopId(stop_id, date) {
  const [rows] = await db.query(
    `SELECT * 
    FROM route r 
    JOIN stop s ON r.route_id = s.route_id 
    JOIN route_assignment ra ON ra.route_id = r.route_id 
    WHERE s.stop_id = ? AND r.is_deleted = 0
    AND ra.run_date = ? AND ra.is_deleted = 0 
    `,
    [stop_id, date]
  );
  return rows || null;
}

// Thêm tuyến đường mới
async function create(route) {
  const { route_name } = route;
  const [result] = await db.query("INSERT INTO route (route_name) VALUES (?)", [
    route_name,
  ]);
  return { route_id: result.insertId, route_name };
}

// Cập nhật tuyến đường
async function update(id, route) {
  const { route_name } = route;
  const [result] = await db.query(
    "UPDATE route SET route_name = ? WHERE route_id = ? AND is_deleted = 0",
    [route_name, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route not found or already deleted");
  }

  return { route_id: id, route_name };
}

// Xóa mềm tuyến đường
async function softDelete(id) {
  const [result] = await db.query(
    "UPDATE route SET is_deleted = 1 WHERE route_id = ? AND is_deleted = 0",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Route not found or already deleted");
  }

  return { message: "Route soft deleted successfully" };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  softDelete,
  getByStopId,
  getByDateStopId,
};
