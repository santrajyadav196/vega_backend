const JWT = require("jsonwebtoken");

exports.generateLoginAccessToken = (payload) => {
  return JWT.sign(payload, process.env.LOGIN_SECRET_KEY, {
    expiresIn: "24h",
  });
};
