import ILoginManager from "./ILoginManager";
import IUserRepository from "./Repository/IUserRepository";
import UserRepositoryFactory from "./Factory/UserRepositoryFactory";
import loginUserStore from '../../Store/LoginUsersStore'
import User from "./User";
import AuthenticationException from "../Exception/AuthenticationException";
import { Socket } from "socket.io";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import roomManager from "../Room/RoomManager";
import userService from '../User/Service';
import userEventEmitter from '../User/UserEventEmitter';

class LoginManager implements ILoginManager{

    repository: IUserRepository;

    constructor(){
        this.repository = UserRepositoryFactory.create();
    }

    async login(credentials: Credentials): Promise<User> {
        if(await this.repository.credentials(credentials)){
            logger.info(`LoginManager.login() -> 1/2 ログイン処理開始:${credentials.email}`);
            const user: User = await this.repository.getUserByCredentials(credentials);
            logger.info(`LoginManager.login() -> 2/2 ログイン処理完了:${credentials.email}`);
            return user;
        }
        throw new AuthenticationException('認証情報が間違っています。未登録の場合は登録して下さい。');
    }

    async afterCredentials(credentials: Credentials, socket: Socket) {
       
        const user: User = await userService.getUserByCredentials(credentials);
        const information_room = await roomManager.getInformationRoomId(user.id);
        const toMe: AfterLoginInfo = {id: user.id,name: user.name,information_room: information_room};
        const toClient: Client = {id: user.id,name: user.name};

        loginUserStore.set(socket.id,user);
        //入室可能なルームにソケットをジョイン
        await roomManager.joinUser(user,socket);
        //認証用セッション情報設定
        socket.request.session.credentials = credentials;
        //イベント発行
        userEventEmitter.sendLoggedInEvent(toMe,socket);
        userEventEmitter.broadcastUserLoginEvent(toClient,socket);
 
    }

    
    async logout(credentials: Credentials,socket: Socket): Promise<boolean> {
        if(await this.repository.credentials(credentials)){
            this.logoutHandler(socket);
            return true;
        }
        return false;
    }

    //切断によるログアウト
    disconnectedLogout(socket: Socket){
        this.logoutHandler(socket);
    }

    //ログアウト
    logoutHandler(socket: Socket){
        if(this.getSocketNumsUsingThisUser(socket.id) == 1){
            const {user,exist} = loginUserStore.getUserInUsersMap(socket.id);
            if(exist){
                //ログアウトイベントのブロードキャストは接続数が１のときだけ発行する。（他の端末で接続している可能性もあるので）
                socket.broadcast.emit('broadcast:user-logout', user!.id);
            }else{
                throw new Exception(`ログインしていない状態でログアウト処理が行われました。ログを確認して下さい。: socketid -> ${socket.id}`);
            }
        }
        loginUserStore.delete(socket.id);
    }
    

    async authenticate(credentials: Credentials): Promise<boolean> {
        return await this.repository.credentials(credentials);
    }    

    //ソケットIDからuserを取得。userが使用しているソケット数を返す
    getSocketNumsUsingThisUser(socket_id: string): number{
        return loginUserStore.getSocketNumUsingThisUser(socket_id);
    }

    //user_idからソケットを取得する
    getSocketFromUserId(user_id: string): string | undefined{
        const socket_id = loginUserStore.getSocketByUserId(user_id);
        return socket_id == '' ? undefined : socket_id;
    }

}
export default new LoginManager;