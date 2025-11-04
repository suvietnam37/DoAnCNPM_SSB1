// // backend/socket/socketManager.js
// const { Server } = require("socket.io");
// const Stop = require("../models/Stop");
// const Location = require("../models/Location");

// let io;

// // Hàm tính khoảng cách giữa 2 điểm GPS theo mét (haversine formula)
// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Bán kính Trái Đất (m)
//   const radLat1 = (lat1 * Math.PI) / 180;
//   const radLat2 = (lat2 * Math.PI) / 180;
//   const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
//   const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(deltaLat / 2) ** 2 +
//     Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2;

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Khoảng cách tính bằng mét
// }

// function initSocket(httpServer) {
//   io = new Server(httpServer, {
//     cors: { origin: "http://localhost:3000" },
//   });
//   console.log("Socket.IO server đã được khởi tạo.");

//   io.on("connection", (socket) => {
//     console.log(`Một người dùng đã kết nối: ${socket.id}`);

//     // --- SỰ KIỆN 1: THAM GIA PHÒNG ---
//     socket.on("join_route_room", (routeId) => {
//       if (!routeId) return;
//       console.log(`Client ${socket.id} tham gia phòng của tuyến ${routeId}`);
//       socket.join(`route_${routeId}`);
//     });

//     // --- SỰ KIỆN 2: CẬP NHẬT VỊ TRÍ (DUY NHẤT) ---
//     socket.on("update_location", async (data) => {
//       const { assignment_id, route_id, lat, lng } = data;
//       if (!assignment_id || !route_id || !lat || !lng) return;

//       console.log(`Nhận vị trí cho tuyến ${route_id}: (${lat}, ${lng})`);

//       // 1. Lưu vị trí mới vào DB
//       await Location.upsert({ assignment_id, latitude: lat, longitude: lng });

//       // 2. Phát vị trí mới đến TẤT CẢ PHỤ HUYNH trong phòng của tuyến đó
//       io.to(`route_${route_id}`).emit("new_location", {
//         assignment_id,
//         lat,
//         lng,
//       });

//       // 3. Xử lý Geofencing ngay tại đây
//       try {
//         const stops = await Stop.getByRouteId(route_id);
//         for (const stop of stops) {
//           if (stop.latitude && stop.longitude) {
//             const distance = calculateDistance(
//               lat,
//               lng,
//               stop.latitude,
//               stop.longitude
//             );
//             // Khi xe đến gần trong bán kính 200m
//             if (distance <= 200) {
//               // Phát cảnh báo geofence cũng CHỈ đến những người trong phòng
//               io.to(`route_${route_id}`).emit("approaching_stop", {
//                 stopName: stop.stop_name,
//                 distance: Math.round(distance),
//               });
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Lỗi khi xử lý Geofence:", error);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log(`Người dùng đã ngắt kết nối: ${socket.id}`);
//     });
//   });
// }

// // Hàm lấy đối tượng io để dùng nơi khác (ví dụ trong controller)
// function getIO() {
//   if (!io) {
//     throw new Error("Socket.IO chưa được khởi tạo!");
//   }
//   return io;
// }

// module.exports = { initSocket, getIO };

const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  console.log("✅ Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // ===============================
    // ✅ 1) PHỤ HUYNH JOIN ROOM ROUTE
    // ===============================
    socket.on("join_route_room", (routeId) => {
      const roomName = `route_${routeId}`;
      socket.join(roomName);
      console.log(`👨‍👩‍👧 Client ${socket.id} JOINED room ${roomName}`);
    });

    // ===============================
    // ✅ 2) PHỤ HUYNH LEAVE ROOM ROUTE
    // ===============================
    socket.on("leave_route_room", (routeId) => {
      const roomName = `route_${routeId}`;
      socket.leave(roomName);
      console.log(`🚪 Client ${socket.id} LEFT room ${roomName}`);
    });

    // ========================================================
    // ✅ 3) TÀI XẾ GỬI VỊ TRÍ MỚI → PHÁT CHO ROOM CỦA TUYẾN
    // ========================================================
    socket.on("driver_new_location", ({ routeId, lat, lng }) => {
      const roomName = `route_${routeId}`;
      io.to(roomName).emit("new_location", { lat, lng });

      console.log(`🚌 New location for ${roomName}: lat=${lat}, lng=${lng}`);
    });

    // ===============================================================
    // ✅ 4) TÀI XẾ GỬI CẢNH BÁO → PHÁT CHO ROOM CỦA TUYẾN
    // ===============================================================
    socket.on("driver_approaching_stop", ({ routeId, stopName, distance }) => {
      const roomName = `route_${routeId}`;
      io.to(roomName).emit("approaching_stop", { stopName, distance });

      console.log(
        `⚠️ Approaching stop for ${roomName}: ${stopName} (${distance}m)`
      );
    });

    // Ngắt kết nối
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

module.exports = { initSocket };
