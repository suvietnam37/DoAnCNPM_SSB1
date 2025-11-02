const RouteAssignment = require("../../models/Route_assignment");

// Lấy danh sách tất cả phân công tuyến
exports.getAllRouteAssignments = async (req, res) => {
  try {
    const { driver_id } = req.query; // Lấy driver_id từ query parameter
    let results;

    if (driver_id) {
      results = await RouteAssignment.getByDriverId(driver_id);
    } else {
      results = await RouteAssignment.getAll();
    }

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
    if (!routeAssignment)
      return res.status(404).json({ error: "Phân công tuyến không tồn tại" });
    res.json(routeAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy phân công tuyến" });
  }
};

// Thêm phân công tuyến mới
exports.createRouteAssignment = async (req, res) => {
  try {
    const { route_id, driver_id, bus_id, run_date, status, departure_time } =
      req.body;

    if (
      !route_id ||
      !driver_id ||
      !bus_id ||
      !run_date ||
      !status ||
      !departure_time
    ) {
      return res
        .status(400)
        .json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const newRouteAssignment = await RouteAssignment.create({
      route_id,
      driver_id,
      bus_id,
      run_date,
      status,
      departure_time,
    });
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
    const { route_id, driver_id, bus_id, run_date, status, departure_time } =
      req.body;
    if (
      !route_id ||
      !driver_id ||
      !bus_id ||
      !run_date ||
      !status ||
      !departure_time
    ) {
      return res
        .status(400)
        .json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const updatedRouteAssignment = await RouteAssignment.update(id, {
      route_id,
      driver_id,
      bus_id,
      run_date,
      status,
      departure_time,
    });
    res.json(updatedRouteAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật phân công tuyến" });
  }
};

// Cập nhật phân công tuyến
exports.startRouteAssignment = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res
        .status(400)
        .json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const updatedRouteAssignment = await RouteAssignment.start(id, status);
    res.json(updatedRouteAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật phân công tuyến" });
  }
};

exports.updateCurrentNextStopRouteAssignment = async (req, res) => {
  try {
    const id = req.params.assignmentId;
    const { current_stop_id, next_stop_id } = req.body;

    const updated = await RouteAssignment.updateStops(
      id,
      current_stop_id,
      next_stop_id
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật current/next stop" });
  }
};

// Xóa phân công tuyến
exports.deleteRouteAssignment = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await RouteAssignment.softDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa phân công tuyến" });
  }
};

// Lấy tuyến đang chạy
exports.getCurrentAssignment = async (req, res) => {
  try {
    const { driver_id, route_id } = req.query;

    let assignment;

    if (driver_id) {
      assignment = await RouteAssignment.getCurrentByDriverId(driver_id);
    } else if (route_id) {
      assignment = await RouteAssignment.getCurrentByRouteId(route_id);
    } else {
      return res
        .status(400)
        .json({ error: "Cần cung cấp driver_id hoặc route_id" });
    }

    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy phân công hiện tại" });
  }
};

exports.getStopCount = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const stopCount = await RouteAssignment.getStopCountByAssignmentId(
      assignmentId
    );

    res.json({ assignment_id: assignmentId, stop_count: stopCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy số lượng stop" });
  }
};
