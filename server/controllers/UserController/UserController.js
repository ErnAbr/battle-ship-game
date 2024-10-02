const express = require("express");
const router = express.Router();
const User = require("./user.model");

router.post("/", async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await User.findOne({ userEmail: userData.userEmail });
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

router.get("/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  return res.status(200).send(user);
});

module.exports = router;
