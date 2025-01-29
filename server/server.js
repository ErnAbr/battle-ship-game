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

//WebSocket Logic
const games = {};
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("join-game", (gameId, user, ships) => {
    if (!games[gameId]) {
      games[gameId] = { players: {}, readyCount: 0 };
    }

    games[gameId].players[user] = { ships, socketId: socket.id };
    console.log(`${user} joined game ${gameId}`);
  });

  games[gameId].readyCount++;

  if (games[gameId].readyCount === 2) {
    const players = Object.keys(games[gameId].players);
    const [player1, player2] = players;

    const player1SocketId = games[gameId].players[player1].socketId;
    const player2SocketId = games[gameId].players[player2].socketId;

    const player1Ships = games[gameId].players[player1].ships;
    const player2Ships = games[gameId].players[player2].ships;

    io.to(player1SocketId).emit("start-game", player2Ships);
    io.to(player2SocketId).emit("start-game", player1Ships);

    games[gameId].readyCount = 0;

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is listening on port ${process.env.SERVER_PORT}`);
});
