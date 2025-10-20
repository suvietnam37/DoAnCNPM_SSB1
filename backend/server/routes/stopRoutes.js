const express = require("express");
const router = express.Router();
const stopController = require("../controllers/stopController");

// CRUD Endpoints
router.get("/", stopController.getAllStops); // GET /api/drivers

module.exports = router;
