// controllers/busController.js
let buses = require("../../models/Bus.js");

// 🔹 Lấy danh sách tất cả xe buýt
exports.getAllBuses = (req, res) => {
  res.json(buses);
};

// 🔹 Lấy thông tin chi tiết 1 xe buýt
exports.getBusById = (req, res) => {
  const id = parseInt(req.params.id);
  const bus = buses.find(b => b.id === id);
  if (!bus) return res.status(404).json({ error: "Bus not found" });
  res.json(bus);
};

// 🔹 Thêm xe buýt mới
exports.createBus = (req, res) => {
  const { licensePlate, driverId } = req.body;

  if (!licensePlate || !driverId)
    return res.status(400).json({ error: "Missing licensePlate or driverId" });

  const exists = buses.find(b => b.licensePlate === licensePlate);
  if (exists) return res.status(400).json({ error: "License plate already exists" });

  const newBus = {
    id: buses.length ? buses[buses.length - 1].id + 1 : 1,
    licensePlate,
    driverId,
  };

  buses.push(newBus);
  res.status(201).json({ message: "Bus created successfully", bus: newBus });
};

// 🔹 Cập nhật thông tin xe buýt
exports.updateBus = (req, res) => {
  const id = parseInt(req.params.id);
  const { licensePlate, driverId } = req.body;

  const bus = buses.find(b => b.id === id);
  if (!bus) return res.status(404).json({ error: "Bus not found" });

  if (licensePlate) bus.licensePlate = licensePlate;
  if (driverId) bus.driverId = driverId;

  res.json({ message: "Bus updated successfully", bus });
};

// 🔹 Xóa xe buýt
exports.deleteBus = (req, res) => {
  const id = parseInt(req.params.id);
  const index = buses.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Bus not found" });

  buses.splice(index, 1);
  res.json({ message: "Bus deleted successfully" });
};
