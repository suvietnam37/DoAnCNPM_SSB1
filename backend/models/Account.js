const db = require("../config/db");

const Account = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       LEFT JOIN role r ON a.role_id = r.role_id`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       LEFT JOIN role r ON a.role_id = r.role_id 
       WHERE a.account_id = ?`,
      [id]
    );
    return rows[0];
  },

  // Account.js (Model)
  async create(data) {
    const { username, password, role_id } = data;
    const [result] = await db.query(
      `INSERT INTO account (username, password, role_id, status)
     VALUES (?, ?, ?, ?)`,
      [username, password, role_id, "Active"]
    );
    return result.insertId;
  },

  async update(id, data) {
    const { username, password, role_id, status } = data;
    const [result] = await db.query(
      `UPDATE account 
       SET username = ?, password = ?, role_id = ?, status = ?
       WHERE account_id = ?`,
      [username, password, role_id || null, status, id]
    );
    return result.affectedRows;
  },

  async updateStatus(id, status) {
    const [result] = await db.query(
      `UPDATE account SET status = ? WHERE account_id = ?`,
      [status, id]
    );
    return result.affectedRows;
  },

  async findByUsername(username) {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       LEFT JOIN role r ON a.role_id = r.role_id 
       WHERE a.username = ?`,
      [username]
    );
    return rows;
  },
};

module.exports = Account;
