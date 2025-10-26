// backend/server/Express.js
const express = require("express");
const http = require('http');
const { initSocket } = require('../socket/socketManager');
const app = express();
// Tạo server HTTP từ app Express
const server = http.createServer(app);
// Khởi tạo Socket.IO và truyền server HTTP vào
initSocket(server);
const cors = require("./middleware/corsConfig");
const errorHandler = require("./middleware/errorHandler");


// Import kết nối MySQL
const connection = require("../config/db"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

// Import routes
const busRoutes = require("./routes/busRoutes");
const driverRoutes = require("./routes/driverRoutes");
const stopRoutes = require("./routes/stopRoutes");
const studentRoutes = require("./routes/studentRoutes");
const parentRoutes = require("./routes/parentRoutes");
const routeRoutes = require("./routes/routeRoutes");
const route_assignmentsRoutes = require("./routes/route_assignmentsRoutes");
const accountRoutes = require("./routes/accountRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Mount routes
app.use("/api/buses", busRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/route_assignments", route_assignmentsRoutes);
app.use("/api/notifications", notificationRoutes);

// Route kiểm tra kết nối DB
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    res.json({ message: "Kết nối DB hoạt động!", result: rows[0].result });
  } catch (error) {
    console.error("Lỗi kiểm tra DB:", error);
    res.status(500).json({ error: "Không thể kết nối đến cơ sở dữ liệu" });
  }
});

app.get("/", (req, res) => {
  res.send("Server Express.js đang chạy tại port 5000!");
});

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server Express và Socket.IO đang chạy tại: http://localhost:${PORT}`);
});