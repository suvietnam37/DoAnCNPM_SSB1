/*const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Express.js đang chạy tại port 5000!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});*/
// backend/server/Express.js
const express = require("express");
const app = express();
const cors = require("./middleware/corsConfig");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const busRoutes = require("./routes/busRoutes");
const driverRoutes = require("./routes/driverRoutes");
const stopRoutes = require("./routes/stopRoutes");
const studentRoutes = require("./routes/studentRoutes");
const parentRoutes = require("./routes/parentRoutes");
const routeRoutes = require("./routes/routeRoutes");
const route_assignmentsRoutes = require("./routes/route_assignmentsRoutes");

app.use(express.json());
app.use(cors);

// Mount routes
app.use("/api/buses", busRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/route_assignments", route_assignmentsRoutes);

app.get("/", (req, res) => {
  res.send("Server Express.js đang chạy tại port 5000!");
});

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
