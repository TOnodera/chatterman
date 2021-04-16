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

app.use(
	cors({
		origin: Config.system.cors,
		credentials: true
	})
);
app.use(express.json());

MiddlewareLoader.sessionMiddleware(app, io);

//ソケットのガード設定
io.use(async (socket: Socket, next: NextFunction) => {

	try {
		logger.debug("ソケット通信の認証開始　セッション内容 -> ", socket.request.session);
		if (await loginManager.getAfterLoginManager(socket).authenticate(socket.request.session.credentials)) {
			logger.debug("認証成功 -> ", socket.request.session);
			next();
		} else {
			throw new AuthenticationException("ログインして下さい。");
		}
	} catch (e) {
		logger.debug("認証成功 -> ", socket.request.session);
		SocketExceptionHandler.handle(e, socket);
	}
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
