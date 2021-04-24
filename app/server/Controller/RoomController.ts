import { ROOM_TYPE } from '../Enum/Enum';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import RoomEventEmitter from '../Domain/Room/Emitter/RoomEventEmitter';
import Room from '../Domain/Room/Room';
import logger from '../Utility/logger';
import userService from '../Domain/User/Service';
import IUser from '../Domain/User/Interface/IUser';
import IRoomRegister from '../Domain/Room/Interface/IRoomRegister';
import RoomRegister from '../Domain/Room/RoomRegister';

class RoomController {

    private socket: Socket;
    private roomEventEmitter: RoomEventEmitter;
    private room: Room;

    constructor(socket: Socket) {
        this.socket = socket;
        this.roomEventEmitter = new RoomEventEmitter(socket);
        this.room = new Room();
    }

    async enter(info: RoomAndUserId) {
        logger.info(`1/2 ルームへの入場処理開始: user_id: ${info.user_id},room_id: ${info.room_id}`);
        try {
            if (await this.room.enter(info)) {
                this.room.getRoomEventEmitter(this.socket).sendUserJoinRoomEvent(info.room_id);
                return;
            }
            this.room.getRoomEventEmitter(this.socket).sendDeniedToEnterRoomEvent(info.room_id);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 ルームへの入場処理完了: user_id: ${info.user_id},room_id: ${info.room_id}`);
    }

    async leave(info: RoomAndUserId) {
        logger.info(`1/2 ルーム退出処理開始: user_id: ${info.user_id}, room_id: ${info.room_id}`);
        try {
            if (await this.room.leave(info)) {
                this.roomEventEmitter.sendUserLeftRoomEvent(info.room_id);
            }
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 ルーム退出処理完了: user_id: ${info.user_id}, room_id: ${info.room_id}`);
    }

    async create(name: string, creater_id: string, room_type: ROOM_TYPE) {
        logger.info(`1/2 ルーム作成処理開始: user_id(作成者): ${creater_id}, name: ${name}`);
        try {
            const register: IRoomRegister = new RoomRegister(name, creater_id, room_type);
            if (await this.room.create(register)) {
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

        const user: IUser = await userService.getUserByCredentials(this.socket.request.session.credentials);
        logger.info(`1/2 トークルーム取得処理開始: user_id: ${user.id},socket_id: ${this.socket.id}`);
        try {

            //トークルームとお知らせルームを取得
            const talkRooms: RoomInfo[] = await this.room.getTalkRooms(user.id);
            const informationRoom: RoomInfo[] = await this.room.getInformationRoom(user.id);
            const rooms: RoomInfo[] = talkRooms.concat(informationRoom);

            this.roomEventEmitter.sendRoomDataEvent(rooms);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
        logger.info(`2/2 トークルーム取得処理完了: user_id: ${user.id},socket_id: ${this.socket.id}`);

    }

    async getDirectMessageRoomInfo() {
        try {
            const user: IUser = await userService.getUserByCredentials(this.socket.request.session.credentials);
            const clients: Client[] = await this.room.getDirectMessageRoomInfo(user.id, this.socket);
            this.roomEventEmitter.sendSendUsersDataEvent(clients);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
    }
}
export default RoomController;
