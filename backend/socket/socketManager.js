// backend/socket/socketManager.js
const { Server } = require("socket.io");
const Stop = require("../models/Stop"); // Import model Stop để lấy danh sách điểm dừng theo routeId

let io;

// Hàm tính khoảng cách giữa 2 điểm GPS theo mét (haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Bán kính Trái Đất (m)
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Khoảng cách tính bằng mét
}

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", // Cho phép frontend kết nối
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket.IO server đã được khởi tạo.");

  io.on("connection", (socket) => {
    console.log(` Người dùng đã kết nối: ${socket.id}`);

    // Nhận dữ liệu vị trí GPS từ client (xe buýt, tài xế, ... gửi lên)
    socket.on("locationUpdate", async (data) => {
      // Dữ liệu client gửi lên có dạng: { vehicleId, routeId, latitude, longitude }
      const { vehicleId, routeId, latitude, longitude } = data;

      if (!routeId || !latitude || !longitude) {
        console.warn("Thiếu thông tin trong locationUpdate:", data);
        return;
      }

      console.log(
        `Xe ${vehicleId} - Tuyến ${routeId}: (${latitude}, ${longitude})`
      );

      try {
        // Lấy danh sách các trạm (stop) thuộc tuyến xe
        const stops = await Stop.getByRouteId(routeId);

        for (const stop of stops) {
          if (!stop.latitude || !stop.longitude) continue;

          const distance = calculateDistance(
            latitude,
            longitude,
            stop.latitude,
            stop.longitude
          );

          // Khi xe đến gần trong bán kính 100m thì gửi thông báo
          if (distance <= 100) {
            const alertData = {
              vehicleId,
              stopId: stop.stop_id,
              stopName: stop.stop_name,
              routeName: stop.route_name,
              message: `Xe ${vehicleId} đã đến gần trạm ${stop.stop_name} (Tuyến ${stop.route_name})!`,
            };

            // Gửi thông báo real-time đến tất cả client
            io.emit("geoAlert", alertData);
            console.log(`Gửi cảnh báo:`, alertData.message);
          }
        }
      } catch (err) {
        console.error("Lỗi khi xử lý geo-fence:", err.message);
      }
    });

    // Khi client ngắt kết nối
    socket.on("disconnect", () => {
      console.log(`Người dùng đã ngắt kết nối: ${socket.id}`);
    });
  });
}

// Hàm lấy đối tượng io để dùng nơi khác (ví dụ trong controller)
function getIO() {
  if (!io) {
    throw new Error("Socket.IO chưa được khởi tạo!");
  }
  return io;
}

module.exports = { initSocket, getIO };
