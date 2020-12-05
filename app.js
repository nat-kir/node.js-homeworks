const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const contactsRouter = require("./api/contacts/contacts.router");

const PORT = process.env.PORT || 3000;

class Server {
  constructor() {
    this.server = null;
  }
  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRouters();
    this.listen();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(morgan("dev"));
  }

  initRouters() {
    this.server.use("/", contactsRouter);
  }
  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on port", PORT);
    });
  }
}

const server = new Server();
server.start();
