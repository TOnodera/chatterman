import ILoginManager from "./ILoginManager";
import IUserRepository from "./IUserRepository";
import UserRepositoryFactory from "./UserRepositoryFactory";
import loginUserStore from '../../Store/LoginUsersStore'
import User from "./User";
import AuthenticationException from "../Exception/AuthenticationException";
import { Socket } from "socket.io";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";

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

    async afterLogin(user: User,socket: Socket){
        logger.info('1/2 LoginManager.afterLogin() -> ログイン後のソケット登録処理開始');
        loginUserStore.set(socket.id,user);
        logger.info('2/2 LoginManager.afterLogin() -> ログイン後のソケット登録処理完了');
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
}
export default new LoginManager;