import { Socket } from 'socket.io';
import IUserRepository from '../Repository/IUserRepository';
import UserRepositoryFactory from '../Factory/UserRepositoryFactory';
import loginUserStore from '../../../Store/LoginUsersStore';
import User from '../User';
import Exception from '../../../Exception/Exception';
import Room from '../../Room/Room';
import userService from '../Service';
import userEventEmitter from '../UserEventEmitter';
import socketService from '../../../Utility/SocketService';
import logger from '../../../Utility/logger';
import IRoom from '../../../Domain/Room/Interface/IRoom';
import IUser from '../Interface/IUser';

class AfterLoginManager {
    private socket: Socket;
    private repository: IUserRepository;

    constructor(socket: Socket) {
        this.socket = socket;
        this.repository = UserRepositoryFactory.create();
    }

    async afterCredentials(credentials: Credentials) {

        logger.debug('in afterLogin: afterCredentials');

        const user: IUser = await userService.getUserByCredentials(credentials);
        const infoRoom: RoomInfo = await user.room().getInformationRoom();
        const toMe: AfterLoginInfo = { id: user.id, name: user.name, information_room: infoRoom.room_id };
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
