// controllers/busController.js
const Bus = require("../../models/Bus");

// Lấy danh sách tất cả xe buýt
exports.getAllBuses = async (req, res) => {
  try {
    const results = await Bus.getAll();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách bus" });
  }
};

// Lấy thông tin chi tiết 1 xe buýt
exports.getBusById = async (req, res) => {
  try {
    const id = req.params.id;
    const bus = await Bus.getById(id);
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.json(bus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy bus" });
  }
};

// Thêm xe buýt mới
exports.createBus = async (req, res) => {
  try {
    const newBus = await Bus.create(req.body);
    res.status(201).json(newBus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm bus" });
  }
};

// Cập nhật xe buýt
exports.updateBus = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBus = await Bus.update(id, req.body);
    res.json(updatedBus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật bus" });
  }
};

// Xóa xe buýt
exports.deleteBus = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Bus.softDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa bus" });
  }
};
