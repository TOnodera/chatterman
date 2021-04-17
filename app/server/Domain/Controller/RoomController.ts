import { ROOM_TYPE } from '../../Enum/Enum';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import RoomEventEmitter from '../Room/Emitter/RoomEventEmitter';
import roomManager from '../Room/RoomManager';
import logger from '../Utility/logger';
import userService from '../User/Service';

class RoomController {
    private socket: Socket;
    private roomEventEmitter: RoomEventEmitter;

    constructor(socket: Socket) {
        this.socket = socket;
        this.roomEventEmitter = new RoomEventEmitter(socket);
    }

    async attemptToEnter(info: RoomAndUserId) {
        logger.info(`1/2 ルームへの入場処理開始: user_id: ${info.user_id},room_id: ${info.room_id}`);
        try {
            if (await roomManager.attemptToEnter(info)) {
                roomManager.getRoomEventEmitter(this.socket).sendUserJoinRoomEvent(info.room_id);
                return;
            }
            roomManager.getRoomEventEmitter(this.socket).sendDeniedToEnterRoomEvent(info.room_id);
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

    async createRoom(name: string, creater_id: string, room_type: ROOM_TYPE) {
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

    async getTalkRooms() {

        const user_id: string = await userService.getUserIdByCredentials(this.socket.request.session.credentials);
        logger.info(`1/2 トークルーム取得処理開始: user_id: ${user_id},socket_id: ${this.socket.id}`);
        try {

            //トークルームとお知らせルームを取得
            const talkRooms: RoomInfo[] = await roomManager.getTalkRooms(user_id);
            const informationRoom: RoomInfo[] = await roomManager.getInformationRoom(user_id);
            const rooms: RoomInfo[] = talkRooms.concat(informationRoom);

            this.roomEventEmitter.sendRoomDataEvent(rooms);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 トークルーム取得処理完了: user_id: ${user_id},socket_id: ${this.socket.id}`);
    }

    async getDirectMessageRoomInfo() {
        try {
            const id: string = await userService.getUserIdByCredentials(this.socket.request.session.credentials);
            const clients: Client[] = await roomManager.getDirectMessageRoomInfo(id, this.socket);
            this.roomEventEmitter.sendSendUsersDataEvent(clients);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
    }
}
export default RoomController;
