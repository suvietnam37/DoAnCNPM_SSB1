const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const white_list = ["/", "/admin"];
  if (white_list.find((item) => "/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      //verify
      try {
        var decode = jwt.verify(token, "84e504f4-f398-4e8d-85c6-d02f732177e8");
        console.log(decode);
        next();
      } catch (error) {
        return res.status(401).json({
          message: " This token not allow / out of date of token ",
        });
      }
    } else {
      return res.status(401).json({
        message: " No access token in header / out of date of token ",
      });
    }
  }
};

module.exports = auth;
