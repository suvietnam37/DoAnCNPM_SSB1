const Account = require("../../models/Account");
const Parent = require("../../models/Parent");
const Driver = require("../../models/Driver");

const { loginService } = require("../../service/accountService");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const data = await loginService(username, password);
  return res.json(data);
};

// accountController.js
const createAccount = async (req, res) => {
  try {
    const { username, password, roleid, related_id } = req.body;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Tạo account
    const accountId = await Account.create({
      username,
      password: hashPassword,
      role_id: roleid,
    });

    // Gán account cho Parent / Driver
    if (roleid === 2 && related_id) {
      await Driver.assignAccount(related_id, accountId);
    } else if (roleid === 3 && related_id) {
      await Parent.assignAccount(related_id, accountId);
    }

    res.status(201).json({ account_id: accountId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi thêm acc" });
  }
};

// Lấy tất cả tài khoản
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.getAll();
    res.json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách tài khoản" });
  }
};

const getAllAccountsByRoleId = async (req, res) => {
  try {
    const { id } = req.params;
    const accounts = await Account.getByRoleId(id);
    res.json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách tài khoản" });
  }
};

const getAccount = async (req, res) => {
  res.status(200).json(req.user);
};

// Lấy tài khoản theo id
const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.getById(id);
    if (!account)
      return res.status(404).json({ error: "Tài khoản không tồn tại" });
    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy tài khoản" });
  }
};

// Cập nhật tài khoản
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, oldPassword, newPassword, roleid, related_id } = req.body;

    const oldAccount = await Account.getById(id);

    if (!oldAccount) {
      return res.status(404).json({ error: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(oldPassword, oldAccount.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mật khẩu cũ không đúng" });
    }

    let hashPassword = oldAccount.password;
    if (newPassword) {
      hashPassword = await bcrypt.hash(newPassword, saltRounds);
    }

    // ✅ cập nhật bảng account
    const affected = await Account.update(id, username, hashPassword, roleid);

    // Xóa liên kết cũ
    if (oldAccount.role_id === 2) {
      const oldDriver = await Driver.getByAccId(oldAccount.account_id);
      await Driver.assignAccount(oldDriver.driver_id, null);
    } else if (oldAccount.role_id === 3) {
      const oldParent = await Parent.getByAccId(oldAccount.account_id);
      await Parent.assignAccount(oldParent.parent_id, null);
    }

    // Gán lại account_id mới
    if (roleid === 2 && related_id) {
      await Driver.assignAccount(related_id, id);
    } else if (roleid === 3 && related_id) {
      await Parent.assignAccount(related_id, id);
    }

    res.json({
      message: "Cập nhật tài khoản thành công",
      affectedRows: affected,
    });
  } catch (error) {
    console.error("Lỗi updateAccount:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật tài khoản" });
  }
};

// Xóa mềm tài khoản
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await Account.softDelete(id);
    res.json({ affectedRows: affected });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi xóa tài khoản" });
  }
};

// Khóa / Mở khóa tài khoản
const updateStatusAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Active' hoặc 'Locked'
    const affected = await Account.updateStatus(id, status);
    res.json({ affectedRows: affected });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });
  }
};

module.exports = {
  handleLogin,
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  updateStatusAccount,
  getAccount,
  getAllAccountsByRoleId,
};
