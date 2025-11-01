const express = require("express");
const router = express.Router();
const routeAssignmentController = require("../controllers/route_assignmentController");

// CRUD Endpoints
router.get("/current", routeAssignmentController.getCurrentAssignment); // GET /api/route_assignments/current?driver_id=1
router.get("/", routeAssignmentController.getAllRouteAssignments); // GET /api/route_assignments
router.get("/:id", routeAssignmentController.getRouteAssignmentById); // GET /api/route_assignments/:id
router.get("/:id/stop-count", routeAssignmentController.getStopCount);

router.post("/", routeAssignmentController.createRouteAssignment); // POST /api/route_assignments
router.put("/:id", routeAssignmentController.updateRouteAssignment); // PUT /api/route_assignments/:id
router.put("/start/:id", routeAssignmentController.startRouteAssignment); // PUT /api/route_assignments/:id
router.delete("/:id", routeAssignmentController.deleteRouteAssignment); // DELETE /api/route_assignments/:id

module.exports = router;
