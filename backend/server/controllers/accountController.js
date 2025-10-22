const Account = require("../../models/Account");
const { loginService } = require("../../service/accountService");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const data = await loginService(username, password);
  return res.json(data);
};

const createAccount = async (req, res) => {
  try {
    const { username, password, roleid } = req.body;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newAcc = await Account.create({
      username,
      password: hashPassword,
      role_id: roleid,
    });
    res.status(201).json(newAcc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi thêm acc" });
  }
};

module.exports = { handleLogin, createAccount };
