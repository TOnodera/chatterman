import { loginManager } from '../Domain/User/LoginManager';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Domain/Exception/SocketExceptionHandler';
import Exception from '../Domain/Exception/Exception';
import User from '../Domain/User/User';
import UserRegister from '../Domain/User/UserRegister';

class UserController {

    async registe(fromClient: UserRegisteInfo) {
        //別のタイプのユーザー登録したくなったらファクトリ作る
        const userRegister: IUserRegister = new UserRegister(fromClient.name, fromClient.credentials);
        await User.registe(userRegister);
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
