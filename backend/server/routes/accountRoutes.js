const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const auth = require("../middleware/auth");

// Đăng nhập
router.post("/login", accountController.handleLogin);

// Tạo tài khoản
router.post("/create", accountController.createAccount);
router.get("/role/:id", accountController.getAllAccountsByRoleId);

router.all(/.*/, auth);

// Lấy tất cả tài khoản
router.get("/", accountController.getAllAccounts);
router.get("/account", accountController.getAccount);

// Lấy tài khoản theo id
router.get("/:id", accountController.getAccountById);

// Cập nhật tài khoản
router.put("/:id", accountController.updateAccount);

// Xóa mềm tài khoản
router.delete("/:id", accountController.deleteAccount);

// Khóa / Mở khóa tài khoản
router.put("/:id/status", accountController.updateStatusAccount);

module.exports = router;
