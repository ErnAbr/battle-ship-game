const GameStats = require("../gamestats.model");

const updateGameStats = async (userId, won) => {
  try {
    let gameStats = await GameStats.findOne({ user: userId });

    if (!gameStats) {
      gameStats = new GameStats({ user: userId });
    }

    gameStats.gamesPlayed += 1;
    if (won) gameStats.wins += 1;
    else gameStats.losses += 1;
    await gameStats.save();

    console.log(`Stats updated for ${userId}.`);
  } catch (error) {
    console.log("Failed to update game stats", error);
  }
};

module.exports = { updateGameStats };
