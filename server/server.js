const configMiddlewares = require("./config/configMiddlewares");
const express = require("express");
const connectDB = require("./libs/database");

const server = express();
configMiddlewares(server);
connectDB();

const UserController = require("./controllers/UserController/UserController");

server.use("/api/users", UserController);

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is listening on port ${process.env.SERVER_PORT}`);
});
