import { Socket } from 'socket.io';
import IUserRepository from '../Repository/IUserRepository';
import UserRepositoryFactory from '../Factory/UserRepositoryFactory';
import loginUserStore from '../../../Store/LoginUsersStore';
import UserEditor from '../UserEditor';
import Exception from '../../../Exception/Exception';
import roomManager from '../../Room/RoomManager';
import userService from '../Service';
import userEventEmitter from '../UserEventEmitter';
import socketService from '../../../Utility/SocketService';
import logger from '../../../Utility/logger';

class AfterLoginManager {
    private socket: Socket;
    private repository: IUserRepository;

    constructor(socket: Socket) {
        this.socket = socket;
        this.repository = UserRepositoryFactory.create();
    }

    async afterCredentials(credentials: Credentials) {

        logger.debug('in afterLogin: afterCredentials');

        const user: UserEditor = await userService.getUserByCredentials(credentials);
        const information_room = await roomManager.getInformationRoomId(user.id);
        const toMe: AfterLoginInfo = { id: user.id, name: user.name, information_room: information_room };
        const toClient: Client = { id: user.id, name: user.name };

        loginUserStore.set(this.socket.id, user);
        //イベント発行
        userEventEmitter.sendLoggedInEvent(toMe, this.socket);
        userEventEmitter.broadcastUserLoginEvent(toClient, this.socket);
    }

    //ログアウト
    logout() {
        if (socketService.getSocketNumsUsingThisUser(this.socket) == 1) {
            const { user, exist } = loginUserStore.getUserInUsersMap(this.socket.id);
            if (exist) {
                //ログアウトイベントのブロードキャストは接続数が１のときだけ発行する。（他の端末で接続している可能性もあるので）
                userEventEmitter.broadcastUserLogout(user!.id, this.socket);
            } else {
                throw new Exception(`ログインしていない状態でログアウト処理が行われました。ログを確認して下さい。: socketid -> ${this.socket.id}`);
            }
        }
    }

    async authenticate(credentials: Credentials): Promise<boolean> {
        if (!credentials) {
            return false;
        }
        return await this.repository.credentials(credentials);
    }
}
export default AfterLoginManager;
