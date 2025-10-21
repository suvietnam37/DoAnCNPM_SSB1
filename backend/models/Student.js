// models/Student.js
const db = require("../config/db");

// Lấy tất cả student
async function getAll() {
  const [rows] = await db.query("SELECT * FROM student");
  return rows;
}

// Lấy student theo ID
async function getById(id) {
  const [rows] = await db.query("SELECT * FROM student WHERE student_id = ?", [id]);
  return rows[0];
}

// Thêm student mới
async function create(student) {
  const { parent_id, stop_id, student_name, class_name, is_absent } = student;
  const [result] = await db.query(
    "INSERT INTO student (parent_id, stop_id, student_name, class_name, is_absent) VALUES (?, ?, ?, ?, ?)",
    [parent_id, stop_id, student_name, class_name, is_absent]
  );
  return { id: result.insertId, ...student };
}

// Cập nhật student
async function update(id, student) {
  const { parent_id, stop_id, student_name, class_name, is_absent } = student;
  await db.query(
    "UPDATE student SET parent_id = ?, stop_id = ?, student_name = ?, class_name = ?, is_absent = ? WHERE student_id = ?",
    [parent_id, stop_id, student_name, class_name, is_absent, id]
  );
  return { id, ...student };
}

// Xóa student
async function remove(id) {
  await db.query("DELETE FROM student WHERE student_id = ?", [id]);
  return { message: "Student deleted successfully" };
}

module.exports = { getAll, getById, create, update, remove };