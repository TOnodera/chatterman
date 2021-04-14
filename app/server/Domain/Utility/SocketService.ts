import { Socket } from 'socket.io';
import loginUserStore from '../../Store/LoginUsersStore'
import User from '../User/User';
class SocketService{

    /**
     * 
     * @param socket 
     * ソケットIDからuserを取得。userが使用しているソケット数を返す
     */
    getSocketNumsUsingThisUser(socket: Socket): number{
        return loginUserStore.getSocketNumUsingThisUser(socket.id);
    }

    /**
     * @param user_id 
     * user_idからソケットIDを取得する
     */
    getSocketsFromUserId(user_id: string): string[]{
        return loginUserStore.getSocketsByUserId(user_id);
    }

    /**
     * 
     * @param user 
     * @param socket 
     * ユーザーをソケットにジョイン
     */
    async joinUser(user: User,socket: Socket){
        for(let room_id of await user.accessAbleRooms()){
            socket.join(room_id);
        }
    }
}

export default new SocketService;