import socketStore from '../Socket';
import acceptRoomsSubject from './Subject/AcceptRoomSubject';
import arrowedToEnterRoomSubject from './Subject/ArrowedToEnterRoomSubject';
import deniedToEnterRoomSubject from './Subject/DeniedToEnterRoomSubject';

class Room {

    current: string;
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

    getRooms(user_id: string){
        socketStore.socket.emit('user:require-rooms',user_id);
    }

    //roomへのアクセス許可が出た場合のリスナ
    arrowedToEnterRoomListener() {
        socketStore.registeOnce('user:join-room', (room_id: string) => {
            this.current = room_id;
            arrowedToEnterRoomSubject.notify(room_id);            
        });
    }

    //roomへのアクセスが拒否された場合のリスナ
    deniedToEnterRoomListener() {
        socketStore.registeOnce('user:denied-to-enter-room', (msg: string) => {
            deniedToEnterRoomSubject.notify(msg);
        });
    }

    acceptRoomsListener(){
        socketStore.registeOnce('user:send-rooms-data',(rooms: any[])=>{
            acceptRoomsSubject.notify(rooms);
        });
    }    

    launchListener(){
        this.acceptRoomsListener();
        this.deniedToEnterRoomListener();
        this.arrowedToEnterRoomListener();
    }

}

export default new Room();