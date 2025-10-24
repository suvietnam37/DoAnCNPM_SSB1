const Student = require("../../models/Student");

// Lấy danh sách tất cả học sinh
exports.getAllStudents = async (req, res) => {
  try {
    const { parent_id } = req.query;
    let results;
    
    if (parent_id) {
        results = await Student.getByParentId(parent_id);
    } else {
        results = await Student.getAll();
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách học sinh" });
  }
};

// Lấy học sinh theo ID
exports.getStudentById = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.getById(id);
    if (!student) return res.status(404).json({ error: "Học sinh không tồn tại" });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy học sinh" });
  }
};

// Thêm học sinh mới
exports.createStudent = async (req, res) => {
  try {
    const { parent_id, stop_id, student_name, class_name, is_absent } = req.body;
    if (!parent_id || !stop_id || !student_name || !class_name) {
      return res.status(400).json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const newStudent = await Student.create({ parent_id, stop_id, student_name, class_name, is_absent: is_absent || 0 });
    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm học sinh" });
  }
};

// Cập nhật học sinh
exports.updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { parent_id, stop_id, student_name, class_name, is_absent } = req.body;
    if (!parent_id || !stop_id || !student_name || !class_name) {
      return res.status(400).json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const updatedStudent = await Student.update(id, { parent_id, stop_id, student_name, class_name, is_absent: is_absent || 0 });
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật học sinh" });
  }
};

// Xóa học sinh
exports.deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Student.softDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa học sinh" });
  }
};

// Lấy học sinh theo route_id
exports.getStudentsByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const students = await Student.getByRouteId(routeId); // Dùng model
    if (students.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy học sinh nào cho tuyến này" });
    }
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách học sinh theo tuyến" });
  }
};