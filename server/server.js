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

app.use("/api/users", UserController);

setupSocket(httpServer);

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is listening on port ${process.env.SERVER_PORT}`);
});
