const jwt = require('jsonwebtoken');
const userModel = require('../Model/userModel');
const asynchandler = require('express-async-handler');

const verifyToken = asynchandler(async (req, res, next) => {
  const { jwt_token } = req.cookies;
  // If Jwt Token not Found
  if (!jwt_token) {
    return res.status(404).send('You must login First');
  }

  // Decoding token
  const decoded = await jwt.verify(jwt_token, process.env.SECRETE_KEY);


  req.user = await userModel.findById(decoded._id);
  next();
});

module.exports = { verifyToken };
