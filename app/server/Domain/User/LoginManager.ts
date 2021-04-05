import ILoginManager from "./ILoginManager";
import IUserRepository from "./IUserRepository";
import UserRepositoryFactory from "./UserRepositoryFactory";
import loginUserStore from '../../Store/LoginUsersStore'
import User from "./User";
import AuthenticationException from "../Exception/AuthenticationException";
import { Socket } from "socket.io";
import Exception from "../Exception/Exception";

class LoginManager implements ILoginManager{

    repository: IUserRepository;

    constructor(){
        this.repository = UserRepositoryFactory.create();
    }

    async login(credentials: Credentials): Promise<User> {
        if(await this.repository.credentials(credentials)){
            const user: User = await this.repository.getUserByCredentials(credentials);
            return user;
        }
        throw new AuthenticationException('登録して下さい。');
    }

    async afterLogin(user: User,socket: Socket){
        loginUserStore.set(socket.id,user);
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