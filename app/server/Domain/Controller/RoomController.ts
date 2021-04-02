import { Socket } from 'socket.io';
import ExceptionHandler from '../Exception/ExceptionHandler';
import roomManager from '../Room/RoomManager';
class RoomController{
    async attemptToEnter(info: RoomAndUserId,socket: Socket){
        if(await roomManager.attemptToEnter(info).catch(e=>{ExceptionHandler.handle(e,socket)})){
            socket.emit('user:join-room',info.room_id);
        }else{
            socket.emit('user:denied-to-enter-room');
        }
    }
    async leaveCurrentRoom(info: RoomAndUserId,socket: Socket){
        if(await roomManager.leaveCurrentRoom(info).catch(e=>{ExceptionHandler.handle(e,socket)})){
            socket.emit('user:left-room',info.room_id);
        }
    }
    async createRoom(name: string,creater_id: string,socket: Socket){
        if(await roomManager.createRoom(name,creater_id).catch(e=>ExceptionHandler.handle(e,socket))){
            socket.emit('room-created');
        }else{
            socket.emit('room-created-failure');
        }
    }
}
export default new RoomController();