import User from "../User/User";
import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";
import roomManager from "../Room/RoomManager";
import userService from '../User/Service';
import DomainException from "../Exception/DomainException";

class UserController {

    private loginManager: LoginManager;

    constructor() {
        this.loginManager = new LoginManager();
    }

    async registe(fromClient: UserRegisteInfo, socket: Socket) {
        const user: User = new User(fromClient.name, fromClient.credentials);
        try {
            if (await user.registe()) {
                const user_id = user.getId();
                //デフォルトのユーザールーム（ダイレクトメッセージ用）を作成
                if (await roomManager.createUserDefaultRoom(user_id)) {
                    socket.emit('user:registered', '登録しました。ログインして下さい。');
                }
            }
        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

    async login(credentials: Credentials, socket: Socket) {
        try {
            const { user, success } = await this.loginManager.login(credentials);
            if (success) {

                let toClient: NotifyLoggedIn = {
                    user: {
                        id: user?.id as string,
                        name: user?.name as string
                    },
                    credentials: user?.credentials as Credentials,
                    isLogin: true
                };

                socket.request.session.credentials = credentials;
                //イベント発行
                socket.emit('user:logged-in', toClient);
    
            }else{
                throw new DomainException('ログイン情報が間違っています。');
            }
        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

    async logout(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.logout(credentials)) {
            socket.emit('user:done-logout');
            socket.request.session.credentials = { email: '', password: '' };
            return;
        }
        socket.emit('user:logout-failure');
    }

    async authenticate(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.authenticate(credentials)) {
            
        }
    }

    async getUsers(socket: Socket) {
        console.log("event accept...");
        socket.emit('user:send-users-data', await userService.getUsers());
    }

}
export default new UserController();