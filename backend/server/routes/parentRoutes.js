const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parentController");

// CRUD Endpoints
router.get("/", parentController.getAllParents);       // GET /api/parents
router.get("/:id", parentController.getParentById);    // GET /api/parents/:id
router.post("/", parentController.createParent);       // POST /api/parents
router.put("/:id", parentController.updateParent);     // PUT /api/parents/:id
router.delete("/:id", parentController.deleteParent);  // DELETE /api/parents/:id

module.exports = router;