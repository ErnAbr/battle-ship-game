const configMiddlewares = require("./config/configMiddlewares");
const express = require("express");
const { createServer } = require("http");
const setupSocket = require("./socket");
const connectDB = require("./libs/database");

const app = express();
const httpServer = createServer(app);

configMiddlewares(app);
connectDB();

const UserController = require("./controllers/UserController/UserController");
const GameStatsController = require("./controllers/GameController/GameController");

app.use("/api/users", UserController);
app.use("/api/games", GameStatsController);

setupSocket(httpServer);

const PORT = process.env.PORT || 3005;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
