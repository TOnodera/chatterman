import Exception from "../Exception/Exception";
import User from "../User/User";
import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";

class UserController {
    private loginManager: LoginManager;
    constructor() {
        this.loginManager = new LoginManager();
    }
    async registe(fromClient: UserRegisteInfo, socket: Socket) {
        const user: User = new User(fromClient.name, fromClient.credentials);
        await user.registe().catch((e: Exception) => ExceptionHandler.handle(e, socket));
        socket.emit('user:registered');
    }
    async login(credentials: Credentials, socket: Socket) {
        try {
            const { user, success } = await this.loginManager.login(credentials);
            if (success) {
                socket.emit('user:logged-in',{
                    user: {
                        id: user?.id,
                        name: user?.name
                    },
                    credentials: user?.credentials,
                    isLogin: true
                });
                socket.request.session.credentials = credentials;
                return;
            }
        } catch (e) {
            ExceptionHandler.handle(e, socket);
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