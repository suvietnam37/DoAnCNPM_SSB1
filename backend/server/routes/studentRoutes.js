const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const auth = require("../middleware/auth");
router.all(/.*/, auth);

// CRUD Endpoints
router.get("/", studentController.getAllStudents); // GET /api/students
router.get("/:id", studentController.getStudentById); // GET /api/students/:id
router.get("/route/:routeId", studentController.getStudentsByRoute); // GET /api/students/route/:routeId
router.post("/", studentController.createStudent); // POST /api/students
router.put("/:id", studentController.updateStudent); // PUT /api/students/:id
router.delete("/:id", studentController.deleteStudent); // DELETE /api/students/:id

module.exports = router;
