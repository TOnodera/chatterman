import { NextFunction } from "express";
import AuthenticationException from "../Exception/AuthenticationException";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import { loginManager } from "../Domain/User/LoginManager";
import logger from "../Domain/Utility/logger";
import { Socket } from "socket.io";

const authenticationMiddleware = async (socket: Socket, next: NextFunction) => {
    logger.debug(1);
    try {
        logger.debug("ソケット通信の認証開始　セッション内容 -> ", socket.request.session);
        if (await loginManager.getAfterLoginManager(socket).authenticate(socket.request.session.credentials)) {
            logger.debug("認証成功 -> ", socket.request.session);
            next();
        } else {
            throw new AuthenticationException("ログインして下さい。");
        }
    } catch (e) {
        logger.debug(2);

        logger.debug("認証成功 -> ", socket.request.session);
        SocketExceptionHandler.handle(e, socket);
    }
    logger.debug(3);

    next();

}

export default authenticationMiddleware;