import RoomController from '../Domain/Controller/RoomController';
import { ROOM_TYPE } from '../Enum/Enum';
import { Socket } from 'socket.io';
import logger from '../Domain/Utility/logger';
import socketService from '../Domain/Utility/SocketService';


module.exports = (socket: Socket) => {
    const roomController = new RoomController(socket);

    //ルーム作成
    const createRoom = async (name: string, user_id: string) => {
        await roomController.createRoom(name, user_id, ROOM_TYPE.talkroom);
    };

    //ダイレクトメッセージルーム情報送信
    const requireUsers = async () => {
        await roomController.getDirectMessageRoomInfo();
    };

    //入室権限があるルーム情報のデータを送信
    const requireRooms = async (user_id: string) => {
        await roomController.getTalkRooms(user_id);
    };

    const attemptToEnter = async (info: RoomAndUserId) => {
        await roomController.attemptToEnter(info);
    };

    const leaveCurrentRoom = async (info: RoomAndUserId) => {
        await roomController.leaveCurrentRoom(info);
    };

    socketService.registeOnce('user:create-room', createRoom, socket);
    socketService.registeOnce('user:require-members', requireUsers, socket);
    socketService.registeOnce('user:require-rooms', requireRooms, socket);
    socketService.registeOnce('user:attempt-to-enter-room', attemptToEnter, socket);
    socketService.registeOnce('user:leave-room', leaveCurrentRoom, socket);

};
