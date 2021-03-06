import { NextFunction } from "express";
import AuthenticationException from "../Exception/AuthenticationException";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import { loginManager } from "../Domain/User/Login/LoginManager";
import logger from "../Utility/logger";
import { Socket } from "socket.io";

const authenticationMiddleware = async (socket: Socket, next: NextFunction) => {
    try {
        if (await loginManager.getAfterLoginManager(socket).authenticate(socket.request.session.credentials)) {
            logger.debug("認証成功 -> ", socket.request.session);
            next();
        } else {
            throw new AuthenticationException("ログインして下さい。");
        }
    } catch (e) {
        logger.debug("認証失敗 -> ", socket.request.session);
        SocketExceptionHandler.handle(e, socket);
    }
    next();

}

export default authenticationMiddleware;