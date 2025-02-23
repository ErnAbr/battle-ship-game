const express = require("express");
const router = express.Router();
const User = require("./user.model");
const generateToken = require("./helpers/generateToken");
const crypto = require("crypto");
const sendEmail = require("./helpers/sendEmail");

router.post("/", async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const existingUserByUserName = await User.findOne({
      username: userData.username,
    });
    if (existingUserByUserName) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = new User({
      ...userData,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();

    const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;

    const emailContent = `
    <h1>Verify Your Email</h1>
    <p>Click the link below to verify your account:</p>
    <a href="${verificationLink}">Verify Email</a>
    <span>please check your spam folder</span>
  `;

    await sendEmail(newUser.email, "Verify Your Account", emailContent);

    return res
      .status(200)
      .send({ message: "Registered Successfully, Please Verify Your Email" });
  } catch (error) {
    return res.status(500).send({ message: "Cannot Register User" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user || !(await user.isCorrectPassword(password))) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    const token = generateToken({ id: user._id, email: user.userEmail });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    return res.status(200).json({ user, message: "Successfully Logged In" });
  } catch (error) {
    return res.status(500).send({ message: "Cannot Login" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).send({ message: "Failed to Logout" });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Email successfully verified! You can now log in." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying email" });
  }
});

module.exports = router;
