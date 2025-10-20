const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

// CRUD Endpoints
router.get("/", driverController.getAllDrivers); // GET /api/drivers

module.exports = router;
