import RoomController from '../Controller/RoomController';
import { ROOM_TYPE } from '../Enum/Enum';
import { Socket } from 'socket.io';
import logger from '../Utility/logger';
import socketService from '../Utility/SocketService';


module.exports = (socket: Socket) => {

    const roomController = new RoomController(socket);

    //ルーム作成
    const create = async (name: string, user_id: string) => {
        await roomController.create(name, user_id, ROOM_TYPE.talkroom);
    };

    //ダイレクトメッセージルーム情報送信
    const getDirectMessageInfo = async () => {
        await roomController.getDirectMessageRoomInfo();
    };

    //入室権限があるルーム情報のデータを送信
    const getTalkRooms = async () => {
        await roomController.getTalkRooms();
    };

    const enter = async (info: RoomAndUserId) => {
        await roomController.enter(info);
    };

    const leave = async (info: RoomAndUserId) => {
        await roomController.leave(info);
    };

    socketService.registeOnce('user:create-room', create, socket);
    socketService.registeOnce('user:require-members', getDirectMessageInfo, socket);
    socketService.registeOnce('user:require-rooms', getTalkRooms, socket);
    socketService.registeOnce('user:attempt-to-enter-room', enter, socket);
    socketService.registeOnce('user:leave-room', leave, socket);

};
