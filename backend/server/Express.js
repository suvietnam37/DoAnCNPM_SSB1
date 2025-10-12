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
const express = require('express');
const app = express();
const cors = require('./middleware/corsConfig');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const busRoutes = require('./routes/busRoutes');
const studentRoutes = require('./routes/studentRoutes');
const routeRoutes = require('./routes/routeRoutes');

app.use(express.json());
app.use(cors);

// Mount routes
app.use('/api/buses', busRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/routes', routeRoutes);

app.get('/', (req, res) => {
  res.send('Server Express.js đang chạy tại port 5000!');
});

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
