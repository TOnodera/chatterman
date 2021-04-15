import { NextFunction } from "express";
import express = require("express");
import { Socket } from "socket.io";
import route from "./Route";
import Config from "./config";
import logger from "./Domain/Utility/logger";

logger.info(Config.system.cors);

const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const session = require("express-session")({
  secret: "St5Q3wPtv4TJ",
  resave: false,
  saveUninitialized: true,
});
const socketListener = require("./Listener");
const io = require("socket.io")(server, {
  cors: {
    origin: Config.system.cors,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: Config.system.cors,
    credentials: true,
  })
);
app.use(express.json());
app.use(session);
io.use((socket: Socket, next: NextFunction) => {
  session(socket.request, {}, next);
});
//app.use(express.static(path.join(__dirname, '../../dist')));
socketListener(io);
//expressルート定義
route(app);
const launch = (port: number) => {
  server.listen(port, () => {
    console.log("Server listening at port %d", port);
  });
};

export default launch;
