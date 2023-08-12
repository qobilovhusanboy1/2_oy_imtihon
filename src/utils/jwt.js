const jwt = require("jsonwebtoken");
const config = require(process.cwd()+"/config");

const sign = (payload) => {return jwt.sign(payload, config.jwtSecretKey, {expiresIn: "3h"})};
const verify = (payload, callback) => {return jwt.verify(payload, config.jwtSecretKey, callback)};

module.exports = {
  sign,
  verify,
};
