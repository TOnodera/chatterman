import { loginManager } from '../Domain/User/Login/LoginManager';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import Exception from '../Exception/Exception';
import UserManager from '../Domain/User/UserManager';
import UserRegister from '../Domain/User/UserRegister';

class UserController {

    async registe(fromClient: UserRegisteInfo) {
        //別のタイプのユーザー登録したくなったらファクトリ作る
        const userRegister: IUserRegister = new UserRegister(fromClient.name, fromClient.credentials);
        await UserManager.registe(userRegister);
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
export default new UserController;
