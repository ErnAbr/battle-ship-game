const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const {
  updateGameStats,
} = require("./controllers/GameController/helpers/updateGameStats");
const User = require("./controllers/UserController/user.model");
const games = {};

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.ORIGIN ||
        "https://battle-ship-game-6d81c130c5a3.herokuapp.com",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-game", (user, ships) => {
      let gameId = Object.keys(games).find(
        (id) => Object.keys(games[id].players).length === 1
      );

      if (!gameId) {
        gameId = uuidv4();
        games[gameId] = { players: {}, hits: {}, ships: {}, currentTurn: null };
      }

      games[gameId].players[user] = { socketId: socket.id };
      games[gameId].ships[user] = ships;

      console.log(`${user} joined game ${gameId}`);

      if (Object.keys(games[gameId].players).length === 2) {
        const players = Object.keys(games[gameId].players);
        const [player1, player2] = players;

        games[gameId].currentTurn = player1;

        const player1Ships = games[gameId].ships[player1];
        const player2Ships = games[gameId].ships[player2];

        io.to(games[gameId].players[player1].socketId).emit(
          "start-game",
          player2Ships
        );
        io.to(games[gameId].players[player2].socketId).emit(
          "start-game",
          player1Ships
        );

        io.to(games[gameId].players[player1].socketId).emit("your-turn");
      }
    });

    socket.on("hit", async (user, coordinate) => {
      const gameId = Object.keys(games).find(
        (id) => games[id].players[user]?.socketId === socket.id
      );

      if (!games[gameId]) {
        console.error(`Game ${gameId} does not exist.`);
        return;
      }

      const opponent = Object.keys(games[gameId].players).find(
        (player) => player !== user
      );

      if (!opponent) {
        console.error(`Opponent not found for game ${gameId}.`);
        return;
      }

      const opponentShips = games[gameId].ships[opponent];

      io.to(games[gameId].players[opponent].socketId).emit(
        "enemy-shot",
        coordinate
      );

      if (opponentShips.includes(coordinate)) {
        if (!games[gameId].hits[user]) {
          games[gameId].hits[user] = [];
        }

        games[gameId].hits[user].push(coordinate);

        const allShipsDestroyed = opponentShips.every((shipCoord) =>
          games[gameId].hits[user].includes(shipCoord)
        );

        if (allShipsDestroyed) {
          console.log(`Game ${gameId} is over! ${user} wins!`);

          const userDoc = await User.findOne({ username: user });
          const opponentDoc = await User.findOne({ username: opponent });

          updateGameStats(userDoc._id, true);
          updateGameStats(opponentDoc._id, false);

          io.to(games[gameId].players[user].socketId).emit("game-over", "win");
          io.to(games[gameId].players[opponent].socketId).emit(
            "game-over",
            "lose"
          );

          delete games[gameId];
          return;
        }

        games[gameId].currentTurn = opponent;
        io.to(games[gameId].players[opponent].socketId).emit("your-turn");
      } else {
        console.log(
          `${user} missed at ${coordinate}. Now it's ${opponent}'s turn!`
        );
        games[gameId].currentTurn = opponent;
        io.to(games[gameId].players[opponent].socketId).emit("your-turn");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
