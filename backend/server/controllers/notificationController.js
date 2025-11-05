// backend/server/controllers/notificationController.js
const Notification = require("../../models/Notification");

exports.getAllNotifications = async (req, res) => {
  try {
    const { account_id, date } = req.query;

    if (date && account_id) {
      const notifications = await Notification.getByAccountIdDate(
        account_id,
        date
      );
      res.json(notifications);
    } else if (!account_id) {
      return res.status(400).json({ error: "Cần cung cấp account_id" });
    } else {
      const notifications = await Notification.getByAccountId(account_id);
      res.json(notifications);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách thông báo" });
  }
};
exports.createNotification = async (req, res) => {
  try {
    const { accountId, content } = req.body;

    const newNotification = await Notification.createNotification(
      accountId,
      content
    );
    res.status(201).json(newNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm tài xế" });
  }
};
