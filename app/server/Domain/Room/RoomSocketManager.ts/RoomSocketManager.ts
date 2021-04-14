import User from "server/Domain/User/User";
import { Socket } from "socket.io";

class RoomSocketManager{

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }

    async joinUser(user: User){
        for(let room_id of await user.accessAbleRooms()){
            this.socket.join(room_id);
        }
    }
}

export default RoomSocketManager;