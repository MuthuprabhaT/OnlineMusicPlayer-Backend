const express = require("express");
const bcrypt = require("bcrypt");
const {
  getUserByEmail,
  generateToken,
} = require("../../controllers/userController");

const router = express.Router();

//Login
router.post("/", async (req, res) => {
  try {
    //Check User Exist or Not
    const user = await getUserByEmail(req);
    if (!user) {
      return res.status(400).send({
        message: "User Not Register, Signup to continue",
        success: false,
      });
    }
    //Validating the password
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(400).send({
        message: "Invalid authorization, password not match",
        success: false,
      });
    }

    //Generate Authotoken and send response
    const authToken = generateToken(user._id);
    const userName = user.username;
    res.status(200).send({
      message: "User Logged In",
      success: true,
      authToken,
      userName,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

module.exports = router;
