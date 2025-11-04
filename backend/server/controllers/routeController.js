const Route = require("../../models/Route");

// Lấy danh sách tất cả tuyến xe
exports.getAllRoutes = async (req, res) => {
  try {
    const results = await Route.getAll();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách tuyến xe" });
  }
};

// Lấy tuyến xe theo ID
exports.getRouteById = async (req, res) => {
  try {
    const id = req.params.id;
    const route = await Route.getById(id);
    if (!route)
      return res.status(404).json({ error: "Tuyến xe không tồn tại" });
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy tuyến xe" });
  }
};

exports.getRouteByStopId = async (req, res) => {
  try {
    const id = req.params.id;
    const route = await Route.getByStopId(id);
    if (!route)
      return res.status(404).json({ error: "Tuyến xe không tồn tại" });
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy tuyến xe" });
  }
};

exports.getRouteByDateStopId = async (req, res) => {
  try {
    const stop_id = req.params.stop_id;
    const date = req.params.date;
    const route = await Route.getByDateStopId(stop_id, date);
    if (!route)
      return res.status(404).json({ error: "Tuyến xe không tồn tại" });
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy tuyến xe" });
  }
};

// Thêm tuyến xe mới
exports.createRoute = async (req, res) => {
  try {
    const { route_name } = req.body;
    if (!route_name) {
      return res.status(400).json({ error: "Tên tuyến xe là bắt buộc" });
    }
    const newRoute = await Route.create({ route_name });
    res.status(201).json(newRoute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm tuyến xe" });
  }
};

// Cập nhật tuyến xe
exports.updateRoute = async (req, res) => {
  try {
    const id = req.params.id;
    const { route_name } = req.body;
    if (!route_name) {
      return res.status(400).json({ error: "Tên tuyến xe là bắt buộc" });
    }
    const updatedRoute = await Route.update(id, { route_name });
    res.json(updatedRoute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật tuyến xe" });
  }
};

// Xóa tuyến xe
exports.deleteRoute = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Route.softDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa tuyến xe" });
  }
};
