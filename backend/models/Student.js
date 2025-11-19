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
    ORDER BY s.student_id ASC
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

async function getStudentAndParent() {
  const [rows] = await db.query(`
    SELECT 
      s.student_id,
      s.student_name,
      s.class_name,
      s.parent_id,
      p.parent_name,
      p.phone,
      p.email,
      p.account_id
    FROM student s
    LEFT JOIN parent p ON s.parent_id = p.parent_id
    WHERE s.is_deleted = 0 AND p.is_deleted = 0 AND p.account_id IS NOT NULL
    
  `);

  return rows;
}

// Lấy học sinh theo parent_id + thông tin điểm dừng, tuyến đường
async function getByParentId(parentId) {
  const [rows] = await db.query(
    `
      SELECT 
        s.*, 
        st.stop_name, st.latitude, st.longitude,
        r.route_name, r.route_id
      FROM student s
      JOIN stop st ON s.stop_id = st.stop_id AND st.is_deleted = 0
      JOIN route r ON st.route_id = r.route_id AND r.is_deleted = 0
      WHERE s.parent_id = ? AND s.is_deleted = 0
      ORDER BY s.student_name
    `,
    [parentId]
  );
  return rows;
}

// Lấy học sinh theo route_id
async function getByRouteId(routeId) {
  const [rows] = await db.query(
    `SELECT 
       *
     FROM student s
     JOIN stop st ON s.stop_id = st.stop_id AND st.is_deleted = 0
     WHERE st.route_id = ? AND s.is_deleted = 0  AND s.is_absent = 0`,
    [routeId]
  );
  return rows;
}

// Thêm học sinh mới
async function create(student) {
  const {
    parent_id,
    stop_id,
    student_name,
    class_name,
    is_absent = 0,
  } = student;
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

  return {
    student_id: id,
    parent_id,
    stop_id,
    student_name,
    class_name,
    is_absent,
  };
}

async function updatedAbsentStudent(id, is_absent) {
  const [result] = await db.query(
    `UPDATE student 
     SET is_absent = ? 
     WHERE student_id = ? AND is_deleted = 0`,
    [is_absent, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Student not found or already deleted");
  }

  return {
    student_id: id,

    is_absent,
  };
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

async function updateStatusById(studentId, status) {
  const student_id = studentId;
  const newStatus = status;
  const [result] = await db.query(
    `UPDATE student 
     SET status = ?
     WHERE student_id = ? AND is_deleted = 0 AND is_absent = 0`,
    [newStatus, student_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Student not found or already deleted");
  }

  return {
    status: newStatus,
    student_id: student_id,
  };
}

// Update tất cả học sinh theo điều kiện (route_id hoặc stop_id hoặc all)
async function updateStatusAll(status) {
  const newStatus = status;
  const [result] = await db.query(
    `UPDATE student 
     SET status = ?
     WHERE is_deleted = 0 AND is_absent = 0`,
    [newStatus]
  );

  if (result.affectedRows === 0) {
    throw new Error("Student not found or already deleted");
  }

  return {
    status: newStatus,
  };
}

module.exports = {
  getAll,
  getById,
  getByParentId,
  getByRouteId,
  create,
  update,
  softDelete,
  updateStatusById,
  updateStatusAll,
  getStudentAndParent,
  updatedAbsentStudent,
};
