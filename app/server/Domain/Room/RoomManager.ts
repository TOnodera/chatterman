import { Socket } from 'socket.io';
import ExceptionHandler from '../Exception/ExceptionHandler';
import User from '../User/User';
import Room from './Room';
class RoomManager{
    async attemptToEnter(info: RoomAndUserId,socket: Socket){
        const user: User = new User(info.user_id);
        if(await user.load() && await user.isAccessable(info.room_id)){
            socket.emit('user:join-room',info.room_id);
            return;
        }
        socket.emit('user:denied-to-enter-room');
    }
    async leaveCurrentRoom(info: RoomAndUserId,socket: Socket){
        const user: User = new User(info.user_id);
        if(await user.load() && await user.isAccessable(info.room_id)){
            socket.emit('user:left-room',info.room_id);
        }
    }
    async joinRoom(user: User){

    }
    async createRoom(name: string,user_id: string,socket: Socket){
        const room: Room = new Room();
        if(await room.create(name,user_id).catch(e=>ExceptionHandler.handle(e,socket))){
            socket.emit('room-created');
        }else{
            socket.emit('room-created-failure');
        }
    }
    
}
export default new RoomManager();