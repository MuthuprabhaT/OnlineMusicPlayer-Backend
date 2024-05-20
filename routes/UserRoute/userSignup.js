const express = require("express");
const bcrypt = require("bcrypt");
const {
  getUserByEmail,
  generateToken,
} = require("../../controllers/userController");
const User = require("../../models/userModel");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    //Check user already exist
    let user = await getUserByEmail(req);
    if (user) {
      return res
        .status(400)
        .send({ message: "User Already Exist!", success: false });
    }
    //Generate Hashed Password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = await new User({
      ...req.body,
      password: hashedPassword,
    }).save();

    //Generate Authtoken and send response
    const authToken = generateToken(user._id);

    res.status(201).send({
      message: "User Registered Successfully",
      success: true,
      authToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message, success: false });
  }
});

module.exports = router;
