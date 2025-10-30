// models/Student.js
const db = require("../config/db");

// Lấy tất cả học sinh
async function getAll() {
  const [rows] = await db.query(`
    SELECT 
      s.*, 
      st.stop_name, st.latitude, st.longitude,
      r.route_name,
      p.parent_name
    FROM student s
    JOIN stop st ON s.stop_id = st.stop_id AND st.is_deleted = 0
    JOIN route r ON st.route_id = r.route_id AND r.is_deleted = 0
    JOIN parent p ON s.parent_id = p.parent_id AND p.is_deleted = 0
    WHERE s.is_deleted = 0
    ORDER BY p.parent_name, s.student_name
  `);
  return rows;
}

// Lấy học sinh theo ID
async function getById(id) {
  const [rows] = await db.query(
    `SELECT 
       s.*, 
       st.stop_name, st.latitude, st.longitude,
       r.route_name,
       p.parent_name
     FROM student s
     JOIN stop st ON s.stop_id = st.stop_id AND st.is_deleted = 0
     JOIN route r ON st.route_id = r.route_id AND r.is_deleted = 0
     JOIN parent p ON s.parent_id = p.parent_id AND p.is_deleted = 0
     WHERE s.student_id = ? AND s.is_deleted = 0`,
    [id]
  );
  return rows[0] || null;
}

// Lấy học sinh theo parent_id + thông tin điểm dừng, tuyến đường
async function getByParentId(parentId) {
  const [rows] = await db.query(`
      SELECT 
        s.*, 
        st.stop_name, st.latitude, st.longitude,
        r.route_name, r.route_id
      FROM student s
      JOIN stop st ON s.stop_id = st.stop_id AND st.is_deleted = 0
      JOIN route r ON st.route_id = r.route_id AND r.is_deleted = 0
      WHERE s.parent_id = ? AND s.is_deleted = 0
      ORDER BY s.student_name
    `, [parentId]);
  return rows;
}

// Lấy học sinh theo route_id
async function getByRouteId(routeId) {
  const [rows] = await db.query(
    `SELECT 
       s.*, 
       st.stop_name, st.latitude, st.longitude,
       p.parent_name
     FROM student s
     JOIN stop st ON s.stop_id = st.stop_id AND st.is_deleted = 0
     JOIN parent p ON s.parent_id = p.parent_id AND p.is_deleted = 0
     WHERE st.route_id = ? AND s.is_deleted = 0
     ORDER BY st.stop_name, s.student_name`,
    [routeId]
  );
  return rows;
}

// Thêm học sinh mới
async function create(student) {
  const { parent_id, stop_id, student_name, class_name, is_absent = 0 } = student;
  const [result] = await db.query(
    `INSERT INTO student 
     (parent_id, stop_id, student_name, class_name, is_absent) 
     VALUES (?, ?, ?, ?, ?)`,
    [parent_id, stop_id, student_name, class_name, is_absent]
  );
  return {
    student_id: result.insertId,
    parent_id,
    stop_id,
    student_name,
    class_name,
    is_absent,
  };
}

// Cập nhật học sinh
async function update(id, student) {
  const { parent_id, stop_id, student_name, class_name, is_absent } = student;
  const [result] = await db.query(
    `UPDATE student 
     SET parent_id = ?, stop_id = ?, student_name = ?, class_name = ?, is_absent = ? 
     WHERE student_id = ? AND is_deleted = 0`,
    [parent_id, stop_id, student_name, class_name, is_absent, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Student not found or already deleted");
  }

  return { student_id: id, parent_id, stop_id, student_name, class_name, is_absent };
}

// Xóa mềm học sinh
async function softDelete(id) {
  const [result] = await db.query(
    `UPDATE student SET is_deleted = 1 WHERE student_id = ? AND is_deleted = 0`,
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Student not found or already deleted");
  }

  return { message: "Student soft deleted successfully" };
}

module.exports = {
  getAll,
  getById,
  getByParentId,
  getByRouteId,
  create,
  update,
  softDelete,
};