const Parent = require("../../models/Parent");

// Lấy danh sách tất cả phụ huynh
exports.getAllParents = async (req, res) => {
  try {
    const results = await Parent.getAll();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách phụ huynh" });
  }
};

// Lấy phụ huynh theo ID
exports.getParentById = async (req, res) => {
  try {
    const id = req.params.id;
    const parent = await Parent.getById(id);
    if (!parent)
      return res.status(404).json({ error: "Phụ huynh không tồn tại" });
    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy phụ huynh" });
  }
};

exports.getParentByAccId = async (req, res) => {
  try {
    const id = req.params.accountId;
    const parent = await Parent.getByAccId(id);
    if (!parent)
      return res.status(404).json({ error: "Phụ huynh không tồn tại" });
    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy phụ huynh" });
  }
};

// Thêm phụ huynh mới
exports.createParent = async (req, res) => {
  try {
    // 1. Chỉ lấy các thông tin của phụ huynh từ body.
    const { parent_name, phone, email } = req.body;

    // 2. Validation.
    if (!parent_name || !phone || !email) {
      return res
        .status(400)
        .json({ error: "Vui lòng nhập đầy đủ Tên, SĐT và Email." });
    }

    // 3. Tạo object mới với account_id là null.
    const newParentData = {
      parent_name,
      phone,
      email,
      account_id: null,
    };

    const newParent = await Parent.create(newParentData);
    res.status(201).json(newParent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm phụ huynh" });
  }
};

// Cập nhật phụ huynh
exports.updateParent = async (req, res) => {
  try {
    const id = req.params.id;
    // 1. Chỉ lấy các thông tin cần sửa từ body.
    const { parent_name, phone, email } = req.body;

    // 2. Validation.
    if (!parent_name || !phone || !email) {
      return res
        .status(400)
        .json({ error: "Vui lòng nhập đầy đủ Tên, SĐT và Email." });
    }

    // 3. Lấy thông tin phụ huynh hiện tại để không làm mất account_id đã liên kết.
    const existingParent = await Parent.getById(id);
    if (!existingParent) {
        return res.status(404).json({ error: "Phụ huynh không tồn tại" });
    }
    
    // 4. Tạo object cập nhật với thông tin mới và account_id cũ.
    const updatedParentData = {
      parent_name,
      phone,
      email,
      account_id: existingParent.account_id, // Giữ lại account_id hiện có
    };

    const updatedParent = await Parent.update(id, updatedParentData);
    res.json(updatedParent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật phụ huynh" });
  }
};

// Xóa phụ huynh
exports.deleteParent = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Parent.softDelete(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa phụ huynh" });
  }
};
