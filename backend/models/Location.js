// backend/models/Location.js
const db = require("../config/db");

async function upsert(locationData) {
  // Upsert = Update or Insert
  const { assignment_id, latitude, longitude } = locationData;
  const sql = `
        INSERT INTO bus_location (assignment_id, latitude, longitude)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude);
    `;
  await db.query(sql, [assignment_id, latitude, longitude]);
}

module.exports = { upsert };
