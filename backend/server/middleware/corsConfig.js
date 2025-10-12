// backend/server/middleware/corsConfig.js
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Cho phép frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = cors(corsOptions);