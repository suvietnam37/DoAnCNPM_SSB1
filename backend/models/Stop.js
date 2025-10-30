// models/Stop.js
const db = require("../config/db");

// Lấy tất cả điểm dừng
async function getAll() {
  const [rows] = await db.query(`
    SELECT s.*, r.route_name 
    FROM stop s
    JOIN route r ON s.route_id = r.route_id AND r.is_deleted = 0
    WHERE s.is_deleted = 0
    ORDER BY r.route_name, s.stop_name
  `);
  return rows;
}

// Lấy điểm dừng theo ID
async function getById(id) {
  const [rows] = await db.query(
    `SELECT s.*, r.route_name 
     FROM stop s
     JOIN route r ON s.route_id = r.route_id AND r.is_deleted = 0
     WHERE s.stop_id = ? AND s.is_deleted = 0`,
    [id]
  );
  return rows[0] || null;
}

// Lấy tất cả điểm dừng theo route_id
async function getByRouteId(routeId) {
  if (!routeId) {
    throw new Error("routeId is required");
  }
  const [rows] = await db.query(
    `SELECT s.*, r.route_name 
     FROM stop s
     JOIN route r ON s.route_id = r.route_id AND r.is_deleted = 0
     WHERE s.route_id = ? AND s.is_deleted = 0
     ORDER BY s.stop_name`,
    [routeId]
  );
  console.log(`[Stop] getByRouteId(${routeId}) -> ${rows.length} results`);
  return rows;
}

// Thêm điểm dừng mới
async function create(stop) {
  const { route_id, stop_name, address, latitude, longitude } = stop;
  const [result] = await db.query(
    `INSERT INTO stop (route_id, stop_name,address, latitude, longitude) 
     VALUES (?, ?,?, ?, ?)`,
    [route_id, stop_name, address, latitude, longitude]
  );
  return {
    stop_id: result.insertId,
    route_id,
    stop_name,
    latitude: latitude,
    longitude: longitude,
  };
}

// Cập nhật điểm dừng
async function update(id, stop) {
  const { route_id, stop_name, latitude, longitude } = stop;
  const [result] = await db.query(
    `UPDATE stop 
     SET route_id = ?, stop_name = ?, latitude = ?, longitude = ? 
     WHERE stop_id = ? AND is_deleted = 0`,
    [route_id, stop_name, latitude || null, longitude || null, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Stop not found or already deleted");
  }

  return { stop_id: id, route_id, stop_name, latitude, longitude };
}

// Xóa mềm điểm dừng
async function softDelete(id) {
  const [result] = await db.query(
    `UPDATE stop SET is_deleted = 1 WHERE stop_id = ? AND is_deleted = 0`,
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Stop not found or already deleted");
  }

  return { message: "Stop soft deleted successfully" };
}

module.exports = {
  getAll,
  getById,
  getByRouteId,
  create,
  update,
  softDelete,
};
