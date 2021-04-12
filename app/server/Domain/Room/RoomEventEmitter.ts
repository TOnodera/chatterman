import { Socket } from "socket.io";

class RoomEventEmitter{

    socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }

    sendUserJoinRoomEvent(room_id: string){
        this.socket.emit('user:join-room', room_id);
    }

    sendDeniedToEnterRoomEvent(room_id: string){
        this.socket.emit('user:denied-to-enter-room',room_id);
    }

    sendUserLeftRoomEvent(room_id: string){
        this.socket.emit('user:left-room', room_id);
    }

    sendRoomCreatedEvent(){
        this.socket.emit('room-created');
    }

    sendRoomCreatedFailureEvnet(){
        this.socket.emit('room-created-failure');
    }

    sendRoomDataEvent(rooms: RoomInfo[]){
        this.socket.emit('user:send-rooms-data', rooms);
    }
    
}

export default RoomEventEmitter;