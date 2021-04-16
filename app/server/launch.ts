import { NextFunction } from 'express';
import express = require('express');
import { Socket } from 'socket.io';
import route from './Http';
import Config from './config';
import logger from './Domain/Utility/logger';
import { loginManager } from './Domain/User/LoginManager';
import AuthenticationException from './Domain/Exception/AuthenticationException';
import SocketExceptionHandler from './Domain/Exception/SocketExceptionHandler';

logger.info(Config.system.cors);

const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const session = require('express-session')({
    secret: 'St5Q3wPtv4TJ',
    resave: false,
    saveUninitialized: true
});
const socketListener = require('./Listener');
const io = require('socket.io')(server, {
    cors: {
        origin: Config.system.cors,
        methods: ['GET', 'POST'],
        credentials: true
    }
});
app.use(
    cors({
        origin: Config.system.cors,
        credentials: true
    })
);
app.use(express.json());
io.use((socket: Socket, next: NextFunction) => {
    session(socket.request, {}, next);
});
app.use(session);
//ソケットのガード設定
io.use(async (socket: Socket, next: NextFunction) => {
    //@ts-ignore
    logger.debug(socket.request);
    /*
  try {
    logger.debug("in auth middleware...");
    logger.debug(socket.request.session);
    if (await loginManager.getAfterLoginManager(socket).authenticate(socket.request.session.credentials)) {
      logger.debug("next()");
      next();
    } else {
      throw new AuthenticationException("ログインして下さい。");
    }
  } catch (e) {
    SocketExceptionHandler.handle(e, socket);
  }
  */
    next();
});
//app.use(express.static(path.join(__dirname, '../../dist')));
socketListener(io);
//expressルート定義
route(app);
const launch = (port: number) => {
    server.listen(port, () => {
        console.log('Server listening at port %d', port);
    });
};

export default launch;
