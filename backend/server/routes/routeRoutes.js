const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Base path: /api/routes

// Lấy toàn bộ danh sách tuyến đường (hỗ trợ phân trang)
router.get('/', routeController.getAllRoutes);

// Tìm kiếm tuyến đường theo tên, điểm đầu, điểm cuối
router.get('/search', routeController.searchRoutes);

// Lấy chi tiết 1 tuyến theo ID
router.get('/:id', routeController.getRouteById);

// Tạo mới tuyến đường
router.post('/', routeController.createRoute);

// Cập nhật tuyến đường
router.put('/:id', routeController.updateRoute);

// Xóa tuyến đường
router.delete('/:id', routeController.deleteRoute);

module.exports = router;
