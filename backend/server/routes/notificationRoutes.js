// backend/server/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/", notificationController.getAllNotifications); // GET /api/notifications?account_id=3

module.exports = router;