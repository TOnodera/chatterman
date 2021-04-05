import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";
import roomManager from "../Room/RoomManager";
import userService from '../User/Service';
import { Client, RoomType, UserRegisteInfo } from "server/@types/types";
import UserRegister from "../User/UserRegister";
import { transaction } from '../Utility/Connection';
import User from '../User/User';

class UserController {

    private loginManager: LoginManager;

    constructor() {
        this.loginManager = new LoginManager();
    }

    async registe(fromClient: UserRegisteInfo, socket: Socket) {
        try {
            const user: UserRegister = new UserRegister(fromClient.name, fromClient.credentials);
            await transaction(async () => {
                const user_id = await user.registe();
                const roomType: RoomType = { Type: 'directmessage' };
                if (user_id && await roomManager.createUserDefaultRoom(user_id, roomType)) { //デフォルトのユーザールームも合わせて作成
                    socket.emit('user:registered', '登録しました。ログインして下さい。');
                } else {
                    socket.emit('user:registered-failure', '登録に失敗しました。');
                }
            });
        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

    async login(credentials: Credentials, socket: Socket) {
        try {

            const user: User = await this.loginManager.login(credentials);
            let toClient: Client = {
                id: user.id,
                name: user.name
            };

            //入室可能なルームにソケットをジョイン
            await roomManager.joinUser(user,socket);
            //認証用セッション情報設定
            socket.request.session.credentials = credentials;
            //イベント発行
            socket.emit('user:logged-in', toClient);
            socket.broadcast.emit('broadcast:user-login', toClient);

        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

    async logout(id: string, credentials: Credentials, socket: Socket) {
        try {
            if (await this.loginManager.logout(credentials)) {
                socket.broadcast.emit('broadcast:user-logout', id);
                socket.request.session.credentials = { email: '', password: '' };
                return;
            }
            socket.emit('user:logout-failure', id);
        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

    async authenticate(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.authenticate(credentials)) {

        }
    }

    async getUsers(socket: Socket) {
        try {
            socket.emit('user:send-users-data', await userService.getUsers());
        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

}
export default new UserController();