const Driver = require("../../models/Driver");

// Lấy danh sách tất cả tài xế
exports.getAllDrivers = async (req, res) => {
  try {
    const results = await Driver.getAll();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách tài xế" });
  }
};

// Lấy tài xế theo ID
exports.getDriverById = async (req, res) => {
  try {
    const id = req.params.id;
    const driver = await Driver.getById(id);
    if (!driver) return res.status(404).json({ error: "Tài xế không tồn tại" });
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy tài xế" });
  }
};

exports.getDriverByAccId = async (req, res) => {
  try {
    const id = req.params.id;
    const driver = await Driver.getByAccId(id);
    if (!driver) return res.status(404).json({ error: "Tài xế không tồn tại" });
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy tài xế" });
  }
};

// Thêm tài xế mới
exports.createDriver = async (req, res) => {
  try {
    const { driver_name, account_id } = req.body;
    if (!driver_name || !account_id) {
      return res
        .status(400)
        .json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const newDriver = await Driver.create({ driver_name, account_id });
    res.status(201).json(newDriver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm tài xế" });
  }
};

// Cập nhật tài xế
exports.updateDriver = async (req, res) => {
  try {
    const id = req.params.id;
    const { driver_name, account_id } = req.body;
    if (!driver_name || !account_id) {
      return res
        .status(400)
        .json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const updatedDriver = await Driver.update(id, { driver_name, account_id });
    res.json(updatedDriver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật tài xế" });
  }
};

// Xóa tài xế
exports.deleteDriver = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Driver.remove(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa tài xế" });
  }
};
