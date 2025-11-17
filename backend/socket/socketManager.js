const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("sendNotification", ({ toUserIds, message }) => {
      console.log("Online Users:", onlineUsers);
      console.log("Sending to:", toUserIds);
      console.log("message: ", message);
      if (!Array.isArray(toUserIds)) toUserIds = [toUserIds];
      toUserIds.forEach((userId) => {
        const targetSocketId = onlineUsers.get(userId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("notification", { message });
        }
      });
    });

    socket.on("startRoute", ({ message, route_id }) => {
      console.log("route_id: ", route_id);
      io.emit("startRoute", { message, route_id });
    });

    socket.on("endRoute", ({ message, route_id }) => {
      io.emit("endRoute", { message, route_id });
    });

    socket.on("confirmStudent", ({ message, student_id }) => {
      io.emit("confirmStudent", { message, student_id });
    });

    socket.on("changeRoute", ({ message, route_id }) => {
      io.emit("changeRoute", { message, route_id });
    });

    socket.on("location", ({ location, route_id }) => {
      io.emit("location", { location, route_id });
    });

    socket.on("nearStop", ({ message, route_id }) => {
      io.emit("nearStop", { message, route_id });
    });

    socket.on("waypoints", ({ waypoints, route_id }) => {
      io.emit("waypoints", { waypoints, route_id });
    });

    socket.on("report", (message) => {
      io.emit("report", message);
    });

    // Ngắt kết nối
    socket.on("disconnect", () => {
      for (let [userId, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
}

module.exports = { initSocket };
