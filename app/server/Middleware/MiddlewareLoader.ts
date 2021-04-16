import { NextFunction } from 'express';
import * as core from 'express-serve-static-core';
import { Socket } from 'socket.io';
import authenticationMiddleware from './authenticationMiddleware';
import express = require('express');
import cors = require('cors');
import Config from '../Config';

const session = require('express-session')({
    secret: Config.system.cookie_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    }
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
        io.use(authenticationMiddleware);
    }

    /**
     * 
     * @param app 
     * expressに適用するミドルウェア
     */
    static httpMiddlewareLoader(app: core.Express) {
        app.use(
            cors({
                origin: Config.system.cors,
                credentials: true
            })
        );
        app.use(express.json());
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
        io.use((socket: Socket, next?: NextFunction) => {
            session(socket.request, {}, next);
        });
    }
}

export default MiddlewareLoader;