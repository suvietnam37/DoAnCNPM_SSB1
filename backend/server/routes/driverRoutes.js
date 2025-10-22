const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

// CRUD Endpoints
router.get("/", driverController.getAllDrivers); // GET /api/drivers
router.get("/:id", driverController.getDriverById); // GET /api/drivers/:id
router.post("/", driverController.createDriver); // POST /api/drivers
router.put("/:id", driverController.updateDriver); // PUT /api/drivers/:id
router.delete("/:id", driverController.deleteDriver); // DELETE /api/drivers/:id

module.exports = router;
