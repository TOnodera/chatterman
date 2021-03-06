import logger from '../Utility/logger';
import { Socket } from 'socket.io';
import UserController from '../Controller/UserController';
import socketService from '../Utility/SocketService';

module.exports = (socket: Socket) => {
    //ログイン直後
    const afterLogin = async (credendtials: Credentials) => {
        logger.debug("user:after-login 受付");
        await UserController.afterCredentials(credendtials, socket);
    };
    //ハンドラ登録
    socketService.registeOnce('user:after-login', afterLogin, socket);
};
