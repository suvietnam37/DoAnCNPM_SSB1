const db = require("./config/db");

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release();
  } catch (error) {
    console.error("Lỗi kết nối MySQL:", error.message);
  }
}

testConnection();
