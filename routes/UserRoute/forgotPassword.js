const express = require("express");
const { getUserByEmail } = require("../../controllers/userController");
const sendEmail = require("../../services/sendEmail");
const crypto = require("crypto");

const router = express.Router();

//Send password link
router.post("/", async (req, res) => {
  try {
    const user = await getUserByEmail(req);

    if (!user)
      return res.status(409).send({
        message: "Email is not registered",
      });

    const randomString = crypto.randomBytes(20).toString("hex");

    const randomStringExpires = Date.now() + 3600000;

    user.randomString = randomString;
    user.randomStringExpires = randomStringExpires;
    await user.save();

    const resetLink = `${process.env.BASE_URL}/verifyRandomString/${randomString}`;

    //HTML content with a clickable button
    const htmlContent = `
        <p>Hello ${user.username},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetLink}">
            <button style="padding: 10px; background-color: #4CAF59; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Reset Password
            </button>
        </a>
        `;

    await sendEmail(user.email, "Password Reset", htmlContent);
    res.status(200).json({
      message: "Password reset link sent to your email",
      randomString: randomString,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
