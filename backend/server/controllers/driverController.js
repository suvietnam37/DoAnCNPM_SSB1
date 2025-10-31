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
    const id = req.params.accountId;
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
    // 1. Chỉ lấy 'driver_name' từ body request.
    const { driver_name } = req.body;

    // 2. Kiểm tra xem 'driver_name' có tồn tại không.
    if (!driver_name) {
      return res.status(400).json({ error: "Tên tài xế là bắt buộc" });
    }

    // 3. Tạo một object driver mới, gán `account_id` là null.
    //    Model Driver.create sẽ nhận object này.
    const newDriverData = {
      driver_name: driver_name,
      account_id: null,
    };

    const newDriver = await Driver.create(newDriverData);
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
    // 1. Chỉ lấy 'driver_name' từ body.
    const { driver_name } = req.body;

    // 2. Validation
    if (!driver_name) {
      return res.status(400).json({ error: "Tên tài xế là bắt buộc" });
    }

    // 3. Lấy thông tin tài xế hiện tại để không làm mất account_id đã liên kết.
    const existingDriver = await Driver.getById(id);
    if (!existingDriver) {
      return res.status(404).json({ error: "Tài xế không tồn tại" });
    }

    // 4. Tạo object cập nhật: tên mới và account_id cũ.
    const updatedDriverData = {
      driver_name: driver_name,
      account_id: existingDriver.account_id, // Giữ lại account_id hiện có
    };

    const updatedDriver = await Driver.update(id, updatedDriverData);
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
    const result = await Driver.softDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa tài xế" });
  }
};
