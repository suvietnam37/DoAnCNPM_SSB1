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

// Thêm phụ huynh mới
exports.createParent = async (req, res) => {
  try {
    const { parent_name, phone, email, account_id } = req.body;
    if (!parent_name || !phone || !email || !account_id) {
      return res
        .status(400)
        .json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const newParent = await Parent.create({
      parent_name,
      phone,
      email,
      account_id,
    });
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
    const { parent_name, phone, email, account_id } = req.body;
    if (!parent_name || !phone || !email || !account_id) {
      return res
        .status(400)
        .json({ error: "Tất cả các trường bắt buộc phải được cung cấp" });
    }
    const updatedParent = await Parent.update(id, {
      parent_name,
      phone,
      email,
      account_id,
    });
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
    const result = await Parent.remove(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa phụ huynh" });
  }
};
