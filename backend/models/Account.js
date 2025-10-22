const db = require("../config/db");

const Account = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       JOIN role r ON a.role_id = r.role_id
       WHERE a.deleted = 0`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       JOIN role r ON a.role_id = r.role_id 
       WHERE a.account_id = ? AND a.deleted = 0`,
      [id]
    );
    return rows[0];
  },

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
       WHERE account_id = ? AND deleted = 0`,
      [username, password, role_id, status, id]
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

  async softDelete(id) {
    const [result] = await db.query(
      `UPDATE account SET deleted = 1 WHERE account_id = ?`,
      [id]
    );
    return result.affectedRows;
  },

  async findByUsername(username) {
    const [rows] = await db.query(
      `SELECT a.*, r.role_name 
       FROM account a 
       JOIN role r ON a.role_id = r.role_id 
       WHERE a.username = ?`,
      [username]
    );
    return rows;
  },
};

module.exports = Account;
