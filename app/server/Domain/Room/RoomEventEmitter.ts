import { Socket } from "socket.io";

class RoomEventEmitter{

    socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }

    sendUserJoinRoomEvent(room_id: string){
        this.socket.emit('room:join-room', room_id);
    }

    sendDeniedToEnterRoomEvent(room_id: string){
        this.socket.emit('room:denied-to-enter-room',room_id);
    }

    sendUserLeftRoomEvent(room_id: string){
        this.socket.emit('room:left-room', room_id);
    }

    sendRoomCreatedEvent(){
        this.socket.emit('room-created');
    }

    sendRoomCreatedFailureEvnet(){
        this.socket.emit('room-created-failure');
    }

    sendRoomDataEvent(rooms: RoomInfo[]){
        this.socket.emit('room:send-rooms-data', rooms);
    }

    sendSendUsersDataEvent(clients: Client[],socket: Socket){
        socket.emit('room:send-directmessage-members-data',clients);       
    }    
}

export default RoomEventEmitter;