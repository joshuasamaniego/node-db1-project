const express = require("express");
const accountsRouter = require('./accounts/accounts-router');
const { logger } = require('./accounts/accounts-middleware');
const server = express();

server.use(express.json());
server.use("/api/accounts", logger, accountsRouter);

module.exports = server;
