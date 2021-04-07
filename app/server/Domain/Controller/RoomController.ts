import { RoomAndUserId, RoomInfo, RoomType } from 'server/@types/types';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import roomManager from '../Room/RoomManager';
import logger from '../Utility/logger';
class RoomController {

    async attemptToEnter(info: RoomAndUserId, socket: Socket) {
        try {
            if (await roomManager.attemptToEnter(info)) {
                logger.info('入室を許可しました。',`user->${info.user_id}`,`room->${info.room_id}`);
                socket.emit('user:join-room', info.room_id);
            } else {
                logger.info('入室を拒否しました。',`user->${info.user_id}`,`room->${info.room_id}`);
                socket.emit('user:denied-to-enter-room',info.room_id);
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

    async getTalkRooms(user_id: string, socket: Socket) {
        try {
            logger.info('ルームデータ要求メッセージ受信');
            logger.info(`1/2 RoomController.getTalkRooms() -> user_id: ${user_id},socket_id: ${socket.id}`);
            const rooms: RoomInfo[] = await roomManager.getTalkRooms(user_id);
            socket.emit('user:send-rooms-data', rooms);
            logger.info(`2/2 RoomController.getTalkRooms() -> データ送信...送信数 ${rooms.length}`);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

}
export default new RoomController();