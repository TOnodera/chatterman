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

class UserController {

    private loginManager: any;

    constructor() {
        this.loginManager = LoginManager;
    }

    async registe(fromClient: UserRegisteInfo): Promise<boolean> {

        logger.info(`1/4 UserController.registe() -> 登録処理開始 name: ${fromClient.name}`);
        const user: UserRegister = new UserRegister(fromClient.name, fromClient.credentials);

        let result: boolean = false;
        await transaction(async () => {

            const user_id = await user.registe();
            logger.info(`2/4 UserController.registe() -> ユーザー作成 name: ${fromClient.name}`);

            const roomType: RoomType = { Type: 'directmessage' };
            if (user_id && await roomManager.createUserDefaultRoom(user_id, roomType)) { //デフォルトのユーザールームも合わせて作成
                result = true;
                logger.info(`3/4 UserController.registe() -> 共通ルームへのアクセスと自分用DMルームへのアクセス設定完了 name: ${fromClient.name}`);
            }
                      
        });
        logger.info(`4/4 UserController.registe() -> 登録処理完了 name: ${fromClient.name}`);
        return result;
    }

    async login(credentials: Credentials): Promise<boolean> {
        logger.info("ログイン処理UserContorollerからLoginManagerに処理委譲");
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
            socket.emit('user:logged-in', toClient);
            socket.broadcast.emit('broadcast:user-login', toClient);

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
            socket.emit('user:logout-failure', id);
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
            logger.info('表示用ユーザー情報要求メッセージを受信');
            socket.emit('user:send-users-data', await userService.getMembers(user_id));
            logger.info('表示用ユーザー情報を送信');
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

}
export default new UserController();