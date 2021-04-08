import { RoomAndUserId, RoomInfo, RoomType } from 'server/@types/types';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import roomManager from '../Room/RoomManager';
import logger from '../Utility/logger';
class RoomController {

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }

    async attemptToEnter(info: RoomAndUserId) {
        try {
            if (await roomManager.attemptToEnter(info)) {
                logger.info('入室を許可しました。',`user->${info.user_id}`,`room->${info.room_id}`);
                this.socket.emit('user:join-room', info.room_id);
            } else {
                logger.info('入室を拒否しました。',`user->${info.user_id}`,`room->${info.room_id}`);
                this.socket.emit('user:denied-to-enter-room',info.room_id);
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
    }

    async leaveCurrentRoom(info: RoomAndUserId) {
        try {
            if (await roomManager.leaveCurrentRoom(info)) {
                this.socket.emit('user:left-room', info.room_id);
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
    }

    async createRoom(name: string, creater_id: string, room_type: RoomType) {
        try {
            if (await roomManager.createRoom(name, creater_id, room_type)) {
                this.socket.emit('room-created');
            } else {
                this.socket.emit('room-created-failure');
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
    }

    async getTalkRooms(user_id: string) {

        try {
            
            logger.info(`1/2 RoomController.getTalkRooms() -> user_id: ${user_id},socket_id: ${this.socket.id}`);

            const rooms: RoomInfo[] = await roomManager.getTalkRooms(user_id);
            this.socket.emit('user:send-rooms-data', rooms);

            logger.info(`2/2 RoomController.getTalkRooms() -> データ送信...送信数 ${rooms.length}`);
        
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }

        
    }

}
export default RoomController;