import { Socket } from 'socket.io';
import loginUserStore from '../../Store/LoginUsersStore';
import UserEditor from '../User/User';
import roomManager from '../Room/RoomManager';

class SocketService {

    /**
     *
     * @param socket
     * ソケットIDからuserを取得。userが使用しているソケット数を返す
     */
    getSocketNumsUsingThisUser(socket: Socket): number {
        return loginUserStore.getSocketNumUsingThisUser(socket.id);
    }

    /**
     * @param user_id
     * user_idからソケットIDを取得する
     */
    getSocketsFromUserId(user_id: string): string[] {
        return loginUserStore.getSocketsByUserId(user_id);
    }

    /**
     *
     * @param user
     * @param socket
     * 自分アクセス可能なルームにジョイン
     */
    async joinMe(user: User, socket: Socket) {
        for (let room_id of await roomManager.getAccessableRooms(user.id)) {
            socket.join(room_id);
        }
    }

    /**
     * 
     * @param event 
     * @param socket
     *  イベントリスナが登録されていれば登録しない。
     * 未登録の場合のみ登録
     */
    registeOnce(event: string, func: any, socket: Socket) {
        if (socket.listenerCount(event) == 0) {
            socket.on(event, func);
        }
    }
}

export default new SocketService();
