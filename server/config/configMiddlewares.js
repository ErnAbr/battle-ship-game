const express = require("express");
const cors = require("cors");

const configMiddlewares = (server) => {
  require("dotenv").config();
  server.use(express.json());
  server.use(cors());
};

module.exports = configMiddlewares;
