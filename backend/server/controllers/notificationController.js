// backend/server/controllers/notificationController.js
const Notification = require("../../models/Notification");

exports.getAllNotifications = async (req, res) => {
  try {
    const { account_id } = req.query;
    if (!account_id) {
      return res.status(400).json({ error: "Cần cung cấp account_id" });
    }
    const notifications = await Notification.getByAccountId(account_id);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách thông báo" });
  }
};