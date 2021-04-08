import { RoomAndUserId, RoomInfo, RoomType } from 'server/@types/types';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import RoomEventEmitter from '../Room/RoomEventEmitter';
import roomManager from '../Room/RoomManager';
import logger from '../Utility/logger';
class RoomController {

    private socket: Socket;
    private roomEventEmitter: RoomEventEmitter;

    constructor(socket: Socket){
        this.socket = socket;
        this.roomEventEmitter = new RoomEventEmitter(socket);
    }

    async attemptToEnter(info: RoomAndUserId) {
        
        logger.info(`1/2 ルームへの入場処理開始: user_id: ${info.user_id},room_id: ${info.room_id}`);
        try {
            if (await roomManager.attemptToEnter(info)) {
                this.roomEventEmitter.sendUserJoinRoomEvent(info.room_id);
                return;
            } 
            this.roomEventEmitter.sendDeniedToEnterRoomEvent(info.room_id);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 ルームへの入場処理完了: user_id: ${info.user_id},room_id: ${info.room_id}`);

    }

    async leaveCurrentRoom(info: RoomAndUserId) {

        logger.info(`1/2 ルーム退出処理開始: user_id: ${info.user_id}, room_id: ${info.room_id}`);
        try {
            if (await roomManager.leaveCurrentRoom(info)) {
                this.roomEventEmitter.sendUserLeftRoomEvent(info.room_id);
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 ルーム退出処理完了: user_id: ${info.user_id}, room_id: ${info.room_id}`);

    }

    async createRoom(name: string, creater_id: string, room_type: RoomType) {

        logger.info(`1/2 ルーム作成処理開始: user_id(作成者): ${creater_id}, name: ${name}`);
        try {
            if (await roomManager.createRoom(name, creater_id, room_type)) {
                this.roomEventEmitter.sendRoomCreatedEvent();
                return;
            }
            this.roomEventEmitter.sendRoomCreatedFailureEvnet();
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 ルーム作成処理完了: user_id(作成者): ${creater_id}, name: ${name}`);

    }

    async getTalkRooms(user_id: string) {

        logger.info(`1/2 トークルーム取得処理開始: user_id: ${user_id},socket_id: ${this.socket.id}`);
        try {
            const rooms: RoomInfo[] = await roomManager.getTalkRooms(user_id);
            this.socket.emit('user:send-rooms-data', rooms);        
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 トークルーム取得処理完了: user_id: ${user_id},socket_id: ${this.socket.id}`);
        
    }

}
export default RoomController;