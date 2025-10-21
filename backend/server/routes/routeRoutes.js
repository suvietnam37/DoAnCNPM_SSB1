const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");

// CRUD Endpoints
router.get("/", routeController.getAllRoutes);         // GET /api/routes
router.get("/:id", routeController.getRouteById);      // GET /api/routes/:id
router.post("/", routeController.createRoute);         // POST /api/routes
router.put("/:id", routeController.updateRoute);       // PUT /api/routes/:id
router.delete("/:id", routeController.deleteRoute);    // DELETE /api/routes/:id

module.exports = router;