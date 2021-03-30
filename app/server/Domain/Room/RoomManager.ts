import { Socket } from 'socket.io';
import User from '../User/User';
class RoomManager{
    async attemptToEnter(info: RoomAndUserId,socket: Socket){
        const user: User = new User(info.user_id);
        if(await user.load() && await user.isAccessable(info.room_id)){
            socket.join(info.room_id);
            socket.emit('user:join-room',info.room_id);
            console.log('send user:join-room',info.room_id);
            return;
        }
        socket.emit('user:denied-to-enter-room');
        console.log('send user:denied-to-enter-room');
    }
    async leaveCurrentRoom(info: RoomAndUserId,socket: Socket){
        const user: User = new User(info.user_id);
        if(await user.load() && await user.isAccessable(info.room_id)){
            socket.leave(info.room_id);
            socket.emit('user:left-room',info.room_id);
            console.log('send user:left-room',info.room_id);
        }
    }
}
export default new RoomManager();