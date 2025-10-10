const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Lấy tất cả học sinh
router.get("/", studentController.getAllStudents);

// Lấy học sinh theo ID
router.get("/:id", studentController.getStudentById);

// Tìm học sinh theo routeId (tuyến xe)
router.get("/route/:routeId", studentController.getStudentsByRoute);

// Thêm học sinh mới
router.post("/", studentController.createStudent);

// Cập nhật học sinh
router.put("/:id", studentController.updateStudent);

// Xóa học sinh
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
