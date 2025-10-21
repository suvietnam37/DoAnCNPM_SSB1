const RouteAssignment = require("../../models/Route_assignment");

// Lấy danh sách tất cả phân công tuyến
exports.getAllRouteAssignments = async (req, res) => {
  try {
    const results = await RouteAssignment.getAll();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách phân công tuyến" });
  }
};

// Lấy phân công tuyến theo ID
exports.getRouteAssignmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const routeAssignment = await RouteAssignment.getById(id);
    if (!routeAssignment) return res.status(404).json({ error: "Phân công tuyến không tồn tại" });
    res.json(routeAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy phân công tuyến" });
  }
};

// Thêm phân công tuyến mới
exports.createRouteAssignment = async (req, res) => {
  try {
    const { route_id, driver_id, bus_id, run_date, status, departure_time } = req.body;
    if (!route_id || !driver_id || !bus_id || !run_date || !status || !departure_time) {
      return res.status(400).json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const newRouteAssignment = await RouteAssignment.create({ route_id, driver_id, bus_id, run_date, status, departure_time });
    res.status(201).json(newRouteAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm phân công tuyến" });
  }
};

// Cập nhật phân công tuyến
exports.updateRouteAssignment = async (req, res) => {
  try {
    const id = req.params.id;
    const { route_id, driver_id, bus_id, run_date, status, departure_time } = req.body;
    if (!route_id || !driver_id || !bus_id || !run_date || !status || !departure_time) {
      return res.status(400).json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const updatedRouteAssignment = await RouteAssignment.update(id, { route_id, driver_id, bus_id, run_date, status, departure_time });
    res.json(updatedRouteAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật phân công tuyến" });
  }
};

// Xóa phân công tuyến
exports.deleteRouteAssignment = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await RouteAssignment.remove(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa phân công tuyến" });
  }
};