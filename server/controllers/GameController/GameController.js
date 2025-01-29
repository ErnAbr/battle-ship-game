const express = require("express");
const router = express.Router();

router.get("/:gameId", (req, res) => {
  const { gameId } = req.params;

  res.status(200).json({ message: `Game State for Game ${gameId}` });
});

module.exports = router;
