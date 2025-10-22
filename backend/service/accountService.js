const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginService = async (username, password) => {
  try {
    const accounts = await Account.findByUsername(username);
    if (accounts) {
      //compare password
      const isMatchPassword = await bcrypt.compare(
        password,
        accounts[0].password
      );
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "User Name, Password không hợp lệ",
        };
      } else {
        //create access token
        const payload = {
          username: accounts[0].username,
          account_id: accounts[0].account_id,
          role: accounts[0].role_name,
        };
        const access_token = jwt.sign(
          payload,
          "84e504f4-f398-4e8d-85c6-d02f732177e8", //jwt-secret
          {
            expiresIn: "1d",
          }
        );
        return {
          access_token,
          EC: 0,
          account: {
            username: accounts[0].username,
            account_id: accounts[0].account_id,
            role: accounts[0].role_name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "user không hợp lệ",
      };
    }
  } catch (error) {
    return null;
  }
};

module.exports = { loginService };
