import { LoginManager, loginManager } from '../User/LoginManager';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import userManager from '../User/UserManager';
import userEventEmitter from '../User/UserEventEmitter';
import Exception from '../Exception/Exception';

class UserController {
    private loginManager: LoginManager;

    constructor() {
        this.loginManager = loginManager;
    }

    async registe(fromClient: UserRegisteInfo) {
        await userManager.registe(fromClient);
    }

    async afterCredentials(credentials: Credentials, socket: Socket) {
        this.loginManager
            .getAfterLoginManager(socket)
            .afterCredentials(credentials)
            .catch((e: Exception) => {
                SocketExceptionHandler.handle(e, socket);
            });
    }

    async logout(id: string, credentials: Credentials, socket: Socket) {
        try {
            if (await this.loginManager.getAfterLoginManager(socket).logout(credentials)) {
                socket.request.session.credentials = { email: '', password: '' };
                return;
            }
            userEventEmitter.sendLogoutFailureEvent(id, socket);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async authenticate(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.getAfterLoginManager(socket).authenticate(credentials)) {
        }
    }
}
export default new UserController();
