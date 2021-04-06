import { RoomAndUserId, RoomInfo, RoomType } from 'server/@types/types';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import roomManager from '../Room/RoomManager';
import logger from '../Utility/logger';
class RoomController {

    async attemptToEnter(info: RoomAndUserId, socket: Socket) {
        try {
            if (await roomManager.attemptToEnter(info)) {
                logger.info('user:join-room',`user->${info.user_id}`,`room->${info.room_id}`);
                socket.emit('user:join-room', info.room_id);
            } else {
                logger.info('user:denied-to-enter-room',`user->${info.user_id}`,`room->${info.room_id}`);
                socket.emit('user:denied-to-enter-room');
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async leaveCurrentRoom(info: RoomAndUserId, socket: Socket) {
        try {
            if (await roomManager.leaveCurrentRoom(info)) {
                socket.emit('user:left-room', info.room_id);
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async createRoom(name: string, creater_id: string, room_type: RoomType, socket: Socket) {
        try {
            if (await roomManager.createRoom(name, creater_id, room_type)) {
                socket.emit('room-created');
            } else {
                socket.emit('room-created-failure');
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async getAllRooms(user_id: string, socket: Socket) {
        try {
            const rooms: RoomInfo[] = await roomManager.getAllRooms(user_id);
            socket.emit('user:send-rooms-data', rooms);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

}
export default new RoomController();