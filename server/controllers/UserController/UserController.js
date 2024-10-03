const express = require("express");
const router = express.Router();
const User = require("./user.model");
const generateToken = require("./helpers/generateToken");

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

    await User(userData).save();

    return res.status(200).send({ message: "Registered Successfully" });
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

module.exports = router;
