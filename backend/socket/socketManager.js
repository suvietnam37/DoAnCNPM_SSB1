// backend/socket/socketManager.js
const { Server } = require("socket.io");

let io;

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000", // Cho phép frontend kết nối
            methods: ["GET", "POST"]
        }
    });

    console.log("Socket.IO server đã được khởi tạo và sẵn sàng.");

    // Lắng nghe sự kiện khi có một client mới kết nối
    io.on('connection', (socket) => {
        console.log(`Một người dùng đã kết nối: ${socket.id}`);

        // Logic xử lý các sự kiện real-time sẽ được thêm vào đây
        socket.on('disconnect', () => {
            console.log(`Người dùng đã ngắt kết nối: ${socket.id}`);
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.IO chưa được khởi tạo!");
    }
    return io;
}

module.exports = { initSocket, getIO };