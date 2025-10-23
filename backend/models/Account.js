const db = require("../config/db");

const Account = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       LEFT JOIN role r ON a.role_id = r.role_id
       WHERE a.is_deleted = 0`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       LEFT JOIN role r ON a.role_id = r.role_id 
       WHERE a.account_id = ? AND a.is_deleted = 0`,
      [id]
    );
    return rows[0];
  },

  async create(data) {
    const { username, password, role_id } = data;
    const [result] = await db.query(
      `INSERT INTO account (username, password, role_id, status, is_deleted)
       VALUES (?, ?, ?, ?, 0)`,
      [username, password, role_id, "Active"]
    );
    return result.insertId;
  },

  async update(id, data) {
    const { username, password, role_id, status } = data;
    const [result] = await db.query(
      `UPDATE account 
       SET username = ?, password = ?, role_id = ?, status = ?
       WHERE account_id = ? AND is_deleted = 0`,
      [username, password, role_id || null, status, id]
    );
    return result.affectedRows;
  },

  async updateStatus(id, status) {
    const [result] = await db.query(
      `UPDATE account 
       SET status = ? 
       WHERE account_id = ? AND is_deleted = 0`,
      [status, id]
    );
    return result.affectedRows;
  },

  async findByUsername(username) {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       LEFT JOIN role r ON a.role_id = r.role_id 
       WHERE a.username = ? AND a.is_deleted = 0`,
      [username]
    );
    return rows;
  },

  async softDelete(id) {
    const [result] = await db.query(
      `UPDATE account 
       SET is_deleted = 1, status = 'Locked' 
       WHERE account_id = ? AND is_deleted = 0`,
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = Account;
