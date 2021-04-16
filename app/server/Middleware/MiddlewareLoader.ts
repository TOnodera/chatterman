import * as core from 'express-serve-static-core';
import { Socket } from 'socket.io';
const session = require('express-session')({
    secret: 'St5Q3wPtv4TJ',
    resave: false,
    saveUninitialized: true
});
/**
 * 起動時に読み込むミドルウェアの設定
 */
class MiddlewareLoader {

    /**
     * 
     * @param socket 
     * socket.ioに適用するミドルウェア
     */
    static socketMiddlewareLoader(io: any) {

    }

    /**
     * 
     * @param app 
     * expressに適用するミドルウェア
     */
    static httpMiddlewareLoader(app: core.Express) {

    }

    /**
     * 
     * @param app 
     * @param io 
     * このミドルウェアでwebsocket接続を開始する最初のhttpリクエストでsessionを共有するさせる
     */
    static sessionMiddleware(app: core.Express, io: any) {
        //httpリクエストのセッションをソケット接続開始する時に共有する
        app.use(session);
        io.use((socket: Socket, next?: any) => {
            session(socket.request, {}, next);
        });
    }
}

export default MiddlewareLoader;