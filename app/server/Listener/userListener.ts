import { Socket } from 'socket.io';
import UserController from '../Domain/Controller/UserController';

module.exports = (socket: Socket) => {
    //ログイン直後
    const afterLogin = async (credendtials: Credentials) => {
        await UserController.afterCredentials(credendtials, socket);
    };

    //ログアウト
    const userLogout = async (id: string, credentials: Credentials) => {
        await UserController.logout(id, credentials, socket);
    };

    //ハンドラ登録
    socket.on('user:after-login', afterLogin);
    socket.on('user:logout', userLogout);
};
