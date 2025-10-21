const express = require("express");
const router = express.Router();
const stopController = require("../controllers/stopController");

// CRUD Endpoints
router.get("/", stopController.getAllStops);          // GET /api/stops
router.get("/:id", stopController.getStopById);       // GET /api/stops/:id
router.post("/", stopController.createStop);          // POST /api/stops
router.put("/:id", stopController.updateStop);        // PUT /api/stops/:id
router.delete("/:id", stopController.deleteStop);     // DELETE /api/stops/:id

module.exports = router;