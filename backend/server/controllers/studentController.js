const { getAll } = require("../../models/Student.js");

// Lấy toàn bộ danh sách học sinh
exports.getAllStudents = async (req, res) => {
  let results = await getAll();
  res.json(results);
};

// Lấy học sinh theo ID
exports.getStudentById = (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.status(200).json(student);
};

// Lấy học sinh theo tuyến xe
exports.getStudentsByRoute = (req, res) => {
  const routeStudents = students.filter(
    (s) => s.routeId === req.params.routeId
  );
  if (routeStudents.length === 0) {
    return res
      .status(404)
      .json({ message: "No students found for this route" });
  }
  res.status(200).json(routeStudents);
};

// Thêm học sinh mới
exports.createStudent = (req, res) => {
  const { id, name, parentPhone, routeId } = req.body;
  if (!id || !name || !parentPhone || !routeId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Kiểm tra trùng ID
  const existing = students.find((s) => s.id === id);
  if (existing) {
    return res.status(409).json({ message: "Student ID already exists" });
  }

  const newStudent = { id, name, parentPhone, routeId };
  students.push(newStudent);
  res.status(201).json(newStudent);
};

// Cập nhật thông tin học sinh
exports.updateStudent = (req, res) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students[index] = { ...students[index], ...req.body };
  res.status(200).json(students[index]);
};

// Xóa học sinh
exports.deleteStudent = (req, res) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deleted = students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully", deleted });
};
