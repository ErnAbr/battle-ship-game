const express = require("express");
const router = express.Router();
const GameStats = require("./gamestats.model");
const authMiddleware = require("../UserController/helpers/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const gameStats = await GameStats.findOne({ user: req.userId });


    if (!gameStats) {
      return res.status(404).send({ message: "Game stats not found" });
    }

    res.status(200).json(gameStats);
  } catch (error) {
    console.log("Error fetching game stats:", error);
    return res.status(500).send({ message: "cannot provide user stats" });
  }
});

module.exports = router;
