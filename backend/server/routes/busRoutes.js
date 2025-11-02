// routes/busRoutes.js
const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

// CRUD Endpoints
router.get("/", busController.getAllBuses); // GET /api/buses
router.get("/:id", busController.getBusById); // GET /api/buses/:id
router.post("/", busController.createBus); // POST /api/buses
router.put("/:id", busController.updateBus); // PUT /api/buses/:id
router.delete("/:id", busController.deleteBus); // DELETE /api/buses/:id

module.exports = router;
