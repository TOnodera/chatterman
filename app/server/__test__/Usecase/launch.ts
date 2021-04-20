import express = require('express');
import route from '../../Http';
import { corsSetting } from '../../Config';
import MiddlewareLoader from '../../Middleware/MiddlewareLoader';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, corsSetting);
const port = 3001;

//セッション共有用
MiddlewareLoader.sessionMiddleware(app, io);
//Http用ミドルウェア設定
MiddlewareLoader.httpMiddlewareLoader(app);
//ソケット用ミドルウェア設定
MiddlewareLoader.socketMiddlewareLoader(io);

//expressルート定義
route(app);

//起動関数
const launch = () => {
    server.listen(port, () => {
        console.log('Server listening at port %d', port);
    });
};

exports.launch = launch;
exports.io = io;
