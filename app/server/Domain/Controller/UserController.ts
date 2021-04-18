import { loginManager } from '../User/LoginManager';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import Exception from '../Exception/Exception';
import User from '../User/User';
import UserRegister from '../User/UserRegister';

class UserController {

    async registe(fromClient: UserRegisteInfo) {
        //別のタイプのユーザー登録したくなったらファクトリ作る
        const userRegister: IUserRegister = new UserRegister(fromClient.name, fromClient.credentials);
        await User.registe(fromClient, userRegister);
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
