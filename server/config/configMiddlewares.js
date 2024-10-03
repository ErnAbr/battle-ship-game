const express = require("express");
const cors = require("cors");

const configMiddlewares = (server) => {
  require("dotenv").config();
  server.use(express.json());
  server.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );
};

module.exports = configMiddlewares;
