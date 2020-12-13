const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const contactsRouter = require("./api/contacts/contacts.router");
const usersRouter = require("./api/users/users.router");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const mongodb_URL = process.env.URI_DB;

class Server {
  constructor() {
    this.server = null;
  }
  async start() {
    this.server = express();
    this.initMiddlewares();
    this.initRouters();
    await this.initDB();
    this.listen();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(morgan("dev"));
  }

  initRouters() {
    this.server.use("/contacts", contactsRouter);
    this.server.use("/users", usersRouter);
  }

  async initDB() {
    try {
      await mongoose.connect(mongodb_URL, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      });
      console.log("Database connection successful");
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on port", PORT);
    });
  }
}

const server = new Server();
server.start();
