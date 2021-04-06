import socketStore from '../Socket';
import acceptRoomsSubject from './Subject/AcceptRoomSubject';
import arrowedToEnterRoomSubject from './Subject/ArrowedToEnterRoomSubject';
import deniedToEnterRoomSubject from './Subject/DeniedToEnterRoomSubject';

class Room {

    private current: string;
    private default: string = 'everybody';
    constructor(){
        this.current = this.default;
    }

    //roomへの入室を試みた際に入室資格があるかチェック
    attemptToEnter(room_id: string, user: User) {
        socketStore.socket.emit('user:attempt-to-enter-room', {
            room_id: room_id,
            user_id: user.id
        });
    }

    leaveCurrent(user: User){
        socketStore.socket.emit('user:leave-room',{
            room_id: this.current,
            user_id: user.id
        });
    }

    createRoom(name: string,user_id: string){
        socketStore.socket.emit('user:create-room',name,user_id);
    }

    getAllRooms(user_id: string){
        socketStore.socket.emit('user:require-rooms',user_id);
    }

    //roomへのアクセス許可が出た場合のリスナ
    arrowedToEnterRoomListener() {
        socketStore.socket.on('user:join-room', (room_id: string) => {
            arrowedToEnterRoomSubject.notify(room_id);            
        });
    }

    //roomへのアクセスが拒否された場合のリスナ
    deniedToEnterRoomListener() {
        socketStore.socket.on('user:denied-to-enter-room', () => {
            deniedToEnterRoomSubject.notify();
        });
    }

    acceptRoomsListener(){
        socketStore.socket.on('user:send-rooms-data',(rooms: any[])=>{
            acceptRoomsSubject.notify(rooms);
        });
    }    

}

export default new Room();