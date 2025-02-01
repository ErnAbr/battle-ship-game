const configMiddlewares = require("./config/configMiddlewares");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./libs/database");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

configMiddlewares(app);
connectDB();

const UserController = require("./controllers/UserController/UserController");
const GameController = require("./controllers/GameController/GameController");

app.use("/api/users", UserController);
app.use("/api/game", GameController);

const games = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-game", (gameId, user, ships) => {
    if (!games[gameId]) {
      games[gameId] = { players: {}, hits: {} };
    }

    games[gameId].hits[user] = [];

    games[gameId].players[user] = { ships, socketId: socket.id };
    console.log(`${user} joined game ${gameId}`);

    if (Object.keys(games[gameId].players).length === 2) {
      const players = Object.keys(games[gameId].players);
      const [player1, player2] = players;

      const player1Ships = games[gameId].players[player1].ships;
      const player2Ships = games[gameId].players[player2].ships;

      io.to(games[gameId].players[player1].socketId).emit(
        "start-game",
        player2Ships
      );
      io.to(games[gameId].players[player2].socketId).emit(
        "start-game",
        player1Ships
      );
    }
  });

  socket.on("hit", (gameId, user, coordinate) => {
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

    const opponentShips = games[gameId].players[opponent].ships;

    if (opponentShips.includes(coordinate)) {
      if (!games[gameId].hits[user]) {
        games[gameId].hits[user] = [];
      }

      games[gameId].hits[user].push(coordinate); 

      if (games[gameId].hits[user].length === opponentShips.length) {
        io.to(games[gameId].players[user].socketId).emit("game-over", "win");
        io.to(games[gameId].players[opponent].socketId).emit(
          "game-over",
          "lose"
        );

        delete games[gameId];
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is listening on port ${process.env.SERVER_PORT}`);
});
