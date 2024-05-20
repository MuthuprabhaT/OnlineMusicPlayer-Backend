const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

function getUserByEmail(request) {
  return User.findOne({
    email: request.body.email,
  });
}

function getUserByRS(request) {
  return User.findOne({
    randomString: request.params.randomString,
  });
}

function getUserById(id) {
  return User.findById(id).select("_id username email");
}

function generateToken(id) {
  return jwt.sign({ userId: id }, process.env.SECRET_KEY);
}

module.exports = { getUserByEmail, getUserByRS, getUserById, generateToken };
