const Stop = require("../../models/Stop");

// Lấy danh sách tất cả điểm dừng
exports.getAllStops = async (req, res) => {
  try {
    const results = await Stop.getAll();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách điểm dừng" });
  }
};

// Lấy điểm dừng theo ID
exports.getStopById = async (req, res) => {
  try {
    const id = req.params.id;
    const stop = await Stop.getById(id);
    if (!stop) return res.status(404).json({ error: "Điểm dừng không tồn tại" });
    res.json(stop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy điểm dừng" });
  }
};

// Thêm điểm dừng mới
exports.createStop = async (req, res) => {
  try {
    const { route_id, stop_name } = req.body;
    if (!route_id || !stop_name) {
      return res.status(400).json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const newStop = await Stop.create({ route_id, stop_name });
    res.status(201).json(newStop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm điểm dừng" });
  }
};

// Cập nhật điểm dừng
exports.updateStop = async (req, res) => {
  try {
    const id = req.params.id;
    const { route_id, stop_name } = req.body;
    if (!route_id || !stop_name) {
      return res.status(400).json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const updatedStop = await Stop.update(id, { route_id, stop_name });
    res.json(updatedStop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật điểm dừng" });
  }
};

// Xóa điểm dừng
exports.deleteStop = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Stop.softDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa điểm dừng" });
  }
};