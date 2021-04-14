import { Socket } from 'socket.io';
import loginUserStore from '../../Store/LoginUsersStore'
import User from '../User/User';
class SocketManager{

    //ソケットIDからuserを取得。userが使用しているソケット数を返す
    getSocketNumsUsingThisUser(socket: Socket): number{
        return loginUserStore.getSocketNumUsingThisUser(socket.id);
    }

    //user_idからソケットを取得する
    getSocketFromUserId(user_id: string): string | undefined{
        const socket_id = loginUserStore.getSocketByUserId(user_id);
        return socket_id == '' ? undefined : socket_id;
    }

    async joinUser(user: User,socket: Socket){
        for(let room_id of await user.accessAbleRooms()){
            socket.join(room_id);
        }
    }
}

export default new SocketManager;