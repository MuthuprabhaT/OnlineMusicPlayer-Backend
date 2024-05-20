const express = require("express");
const { getUserByRS } = require("../../controllers/userController");

const router = express.Router();

router.get("/:randomString", async (req, res) => {
  try {
    const user = await getUserByRS(req);
    console.log(user);
    if (!user) {
      return res.status(400).send({
        message: "Invalid link or link expired",
        success: false,
      });
    }

    //If the random string is valid, you can update the user's status to mark it as verified if needed.

    res.status(200).send({
      message: "Random String Verified",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occured",
      success: false,
    });
    console.log(error);
  }
});

module.exports = router;
