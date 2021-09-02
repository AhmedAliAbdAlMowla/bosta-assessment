"use strict"
if (process.env.NODE_ENV.trim() === "development")
  require("dotenv/config");
module.exports = () => {
  if (!process.env.JWT_PRIVIAT_KEY) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not define. ");
  }
};