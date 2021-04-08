import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import roomManager from "../Room/RoomManager";
import userService from '../User/Service';
import { Client, RoomType, UserRegisteInfo } from "server/@types/types";
import UserRegister from "../User/UserRegister";
import { transaction } from '../Utility/Connection';
import User from '../User/User';
import logger from '../Utility/logger';
import loginUserStore from '../../Store/LoginUsersStore';
import userEventEmitter from '../User/UserEventEmitter';

class UserController {

    private loginManager: any;

    constructor() {
        this.loginManager = LoginManager;
    }

    async registe(fromClient: UserRegisteInfo): Promise<boolean> {

        logger.info(`1/2 UserController.registe() -> 登録処理開始 name: ${fromClient.name}`);

        const user: UserRegister = new UserRegister(fromClient.name, fromClient.credentials);
        const [result]: boolean[] = await transaction(async () => {

            const user_id = await user.registe();
            const roomType: RoomType = { Type: 'directmessage' };
            if (user_id && await roomManager.createUserDefaultRoom(user_id, roomType) && roomManager.createInformationRoom(user_id)) { //デフォルトのユーザールームとお知らせ用のDMルームも合わせて作成
                return true;
            }
            return false;
            
        });

        logger.info(`2/2 UserController.registe() -> 登録処理完了 name: ${fromClient.name}`);

        return result;
    }

    async login(credentials: Credentials): Promise<boolean> {
        await this.loginManager.login(credentials);
        return true;
    }

    async afterCredentials(credentials: Credentials, socket: Socket) {
        try {

            const user: User = await userService.getUserByCredentials(credentials);
            let toClient: Client = {
                id: user.id,
                name: user.name
            };

            loginUserStore.set(socket.id,user);
            //入室可能なルームにソケットをジョイン
            await roomManager.joinUser(user,socket);
            //認証用セッション情報設定
            socket.request.session.credentials = credentials;
            //イベント発行
            userEventEmitter.sendLoggedInEvent(toClient,socket);
            userEventEmitter.broadcastUserLoginEvent(toClient,socket);

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async logout(id: string, credentials: Credentials, socket: Socket) {
        try {
            if (await this.loginManager.logout(credentials,socket)) {
                socket.request.session.credentials = { email: '', password: '' };
                return;
            }
            userEventEmitter.sendLogoutFailureEvent(id,socket);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async authenticate(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.authenticate(credentials)) {

        }
    }

    async getMembers(user_id: string,socket: Socket) {
        try {
            const clients: Client[] = await userService.getMembers(user_id);
            userEventEmitter.sendSendUsersDataEvent(clients,socket);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

}
export default new UserController();