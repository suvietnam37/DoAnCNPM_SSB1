const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Đăng nhập
router.post("/login", accountController.handleLogin);

// Tạo tài khoản
router.post("/create", accountController.createAccount);

// Lấy tất cả tài khoản
router.get("/", accountController.getAllAccounts);

// Lấy tài khoản theo id
router.get("/:id", accountController.getAccountById);

// Cập nhật tài khoản
router.put("/:id", accountController.updateAccount);

// Xóa mềm tài khoản
router.delete("/:id", accountController.deleteAccount);

// Khóa / Mở khóa tài khoản
router.put("/:id/status", accountController.updateStatusAccount);

module.exports = router;
