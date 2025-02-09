const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const configMiddlewares = (server) => {
  require("dotenv").config();
  server.use(express.json());
  server.use(cookieParser());
  server.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );
};

module.exports = configMiddlewares;
