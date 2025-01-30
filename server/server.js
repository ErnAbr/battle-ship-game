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

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is listening on port ${process.env.SERVER_PORT}`);
});
