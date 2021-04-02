import User from "../User/User";
import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";
import roomManager from "../Room/RoomManager";

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

                //デフォルトのユーザールーム作成
                if (await roomManager.createUserDefaultRoom(toClient.user.id)) {
                    socket.request.session.credentials = credentials;
                    //イベント発行
                    socket.emit('user:logged-in', toClient);
                    return;
                }
            }
        } catch (e) {
            ExceptionHandler.handle(e, socket);
            return;
        }
        socket.emit('user:login-failure');
    }

    async logout(credentials: Credentials, socket: Socket) {
        console.log("logout...1");
        if (await this.loginManager.logout(credentials)) {
            console.log("logout...2");
            socket.emit('user:done-logout');
            socket.request.session.credentials = { email: '', password: '' };
            return;
        }
        console.log("logout...3");
        socket.emit('user:logout-failure');
    }

    async authenticate(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.authenticate(credentials)) {

        }
    }

}
export default new UserController();