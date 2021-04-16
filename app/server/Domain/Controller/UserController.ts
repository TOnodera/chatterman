import { loginManager } from '../User/LoginManager';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import userManager from '../User/UserManager';
import Exception from '../Exception/Exception';

class UserController {

    async registe(fromClient: UserRegisteInfo) {
        await userManager.registe(fromClient);
    }

    async afterCredentials(credentials: Credentials, socket: Socket) {
        loginManager
            .getAfterLoginManager(socket)
            .afterCredentials(credentials)
            .catch((e: Exception) => {
                SocketExceptionHandler.handle(e, socket);
            });
    }
}
export default new UserController();
