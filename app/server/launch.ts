
import express = require('express');
import route from './Http';
import { corsSetting } from './Config';
import MiddlewareLoader from './Middleware/MiddlewareLoader';
import path = require('path');
import logger from './Domain/Utility/logger';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, corsSetting);

//セッション共有用
MiddlewareLoader.sessionMiddleware(app, io);
//Http用ミドルウェア設定
MiddlewareLoader.httpMiddlewareLoader(app);
//ソケット用ミドルウェア設定
MiddlewareLoader.socketMiddlewareLoader(io);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

const socketListener = require('./Listener');
socketListener(io);
//expressルート定義
route(app);

//起動
const launch = (port: number) => {
	server.listen(port, () => {
		console.log('Server listening at port %d', port);
	});
};

export default launch;
