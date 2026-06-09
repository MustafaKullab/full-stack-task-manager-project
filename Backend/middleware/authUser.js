const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (token) {
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decodeURI) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Something wend wrong, please login",
        });
      } else {
        req.user = await User.findById(decodeURI.id);
        next();
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "Token is end" });
  }
};

module.exports = authUser;
