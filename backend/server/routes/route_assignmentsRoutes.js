const express = require("express");
const router = express.Router();
const route_assignmentController = require("../controllers/route_assignmentController");

router.get("/", route_assignmentController.getAllRoutes);

module.exports = router;
