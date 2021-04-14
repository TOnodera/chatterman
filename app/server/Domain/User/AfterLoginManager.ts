import { Socket } from "socket.io";
import IUserRepository from "./Repository/IUserRepository";
import UserRepositoryFactory from "./Factory/UserRepositoryFactory";
import loginUserStore from '../../Store/LoginUsersStore'
import User from "./User";
import Exception from "../Exception/Exception";
import roomManager from "../Room/RoomManager";
import userService from '../User/Service';
import userEventEmitter from '../User/UserEventEmitter';
import socketService from '../Utility/SocketService';



class AfterLoginManager{

    private socket: Socket;
    private repository: IUserRepository;

    constructor(socket: Socket){
        this.socket = socket;
        this.repository = UserRepositoryFactory.create();
    }

    async afterCredentials(credentials: Credentials) {
       
        const user: User = await userService.getUserByCredentials(credentials);
        const information_room = await roomManager.getInformationRoomId(user.id);
        const toMe: AfterLoginInfo = {id: user.id,name: user.name,information_room: information_room};
        const toClient: Client = {id: user.id,name: user.name};

        loginUserStore.set(this.socket.id,user);
        //入室可能なルームにソケットをジョイン
        await socketService.joinUser(user,this.socket);
        //認証用セッション情報設定
        this.socket.request.session.credentials = credentials;
        //イベント発行
        userEventEmitter.sendLoggedInEvent(toMe,this.socket);
        userEventEmitter.broadcastUserLoginEvent(toClient,this.socket);
 
    }

    
    async logout(credentials: Credentials): Promise<boolean> {
        if(await this.repository.credentials(credentials)){
            this.logoutHandler(this.socket);
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
        if(socketService.getSocketNumsUsingThisUser(socket) == 1){
            const {user,exist} = loginUserStore.getUserInUsersMap(socket.id);
            if(exist){
                //ログアウトイベントのブロードキャストは接続数が１のときだけ発行する。（他の端末で接続している可能性もあるので）
                userEventEmitter.broadcastUserLogout(user!.id,socket);
                
            }else{
                throw new Exception(`ログインしていない状態でログアウト処理が行われました。ログを確認して下さい。: socketid -> ${socket.id}`);
            }
        }
        loginUserStore.delete(socket.id);
    }
    

    async authenticate(credentials: Credentials): Promise<boolean> {
        return await this.repository.credentials(credentials);
    }    
}
export default AfterLoginManager;