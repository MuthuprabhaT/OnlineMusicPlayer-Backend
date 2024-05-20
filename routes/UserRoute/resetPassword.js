const express = require("express");
const { getUserByRS } = require("../../controllers/userController");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/:randomString", async (req, res) => {
  try {
    console.log("Req:", req.params.randomString);
    const user = await getUserByRS(req);
    console.log("User:", user);
    if (!user) {
      return res.status(400).send({
        message: "Invalid link or link expired",
        success: false,
      });
    }

    user.password = bcrypt.hashSync(req.body.password, 10);
    user.randomString = undefined;
    user.randomStringExpires = undefined;
    await user.save();

    res
      .status(200)
      .send({ message: "Password reset successfully", success: true });
  } catch (error) {
    res.status(500).send({ message: "An error occured", success: false });
    console.log(error);
  }
});

module.exports = router;
