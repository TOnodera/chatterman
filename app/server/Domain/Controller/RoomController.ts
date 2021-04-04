import { RoomAndUserId, RoomInfo } from 'server/@types/types';
import { Socket } from 'socket.io';
import ExceptionHandler from '../Exception/ExceptionHandler';
import roomManager from '../Room/RoomManager';
class RoomController {
    
    async attemptToEnter(info: RoomAndUserId, socket: Socket) {
        if (await roomManager.attemptToEnter(info).catch(e => { ExceptionHandler.handle(e, socket) })) {
            socket.emit('user:join-room', info.room_id);
        } else {
            socket.emit('user:denied-to-enter-room');
        }
    }

    async leaveCurrentRoom(info: RoomAndUserId, socket: Socket) {
        if (await roomManager.leaveCurrentRoom(info).catch(e => { ExceptionHandler.handle(e, socket) })) {
            socket.emit('user:left-room', info.room_id);
        }
    }

    async createRoom(name: string, creater_id: string, socket: Socket) {
        if (await roomManager.createRoom(name, creater_id).catch(e => ExceptionHandler.handle(e, socket))) {
            socket.emit('room-created');
        } else {
            socket.emit('room-created-failure');
        }
    }

    async getAllRooms(user_id: string, socket: Socket) {
        try {
            const rooms: RoomInfo[] = await roomManager.getAllRooms(user_id);
            socket.emit('user:send-rooms-data', rooms);
        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

}
export default new RoomController();