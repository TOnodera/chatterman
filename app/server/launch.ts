import { NextFunction } from 'express';
import express = require('express');
import { Socket } from 'socket.io';
import route from './Http';
import Config from './Config';
import logger from './Domain/Utility/logger';
import { loginManager } from './Domain/User/LoginManager';
import AuthenticationException from './Domain/Exception/AuthenticationException';
import SocketExceptionHandler from './Domain/Exception/SocketExceptionHandler';
import MiddlewareLoader from './Middleware/MiddlewareLoader';

const cors = require('cors');
const app = express();
const server = require('http').createServer(app);

const socketListener = require('./Listener');
const io = require('socket.io')(server, {
	cors: {
		origin: Config.system.cors,
		methods: ['GET', 'POST'],
		credentials: true
	}
});


//セッション共有用
MiddlewareLoader.sessionMiddleware(app, io);
//ソケット用ミドルウェア設定
MiddlewareLoader.socketMiddlewareLoader(io);

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
