import socketStore from './Socket';
import swal from '../util/swal';
import router from '@/router';
class Room {

    private current: string;
    private default: string = 'everybody';
    constructor(){
        this.current = this.default;
        //リスナ起動
        this.arrowedToEnterRoomListener();
        this.deniedToEnterRoomListener();
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
            this.current = room_id;
        });
    }

    //roomへのアクセスが拒否された場合のリスナ
    deniedToEnterRoomListener() {
        socketStore.socket.on('user:denied-to-enter-room', () => {
            swal.fire('入室権限がありません。');
            router.push({name: 'Login'});
        });
    }

    acceptRoomsListener(handler: Function){
        socketStore.socket.on('user:send-rooms-data',(rooms: any[])=>{
            handler(rooms);
        });
    }    

}

export default new Room();