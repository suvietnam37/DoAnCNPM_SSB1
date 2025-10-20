const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parentController");

router.get("/", parentController.getAllParents);

module.exports = router;
