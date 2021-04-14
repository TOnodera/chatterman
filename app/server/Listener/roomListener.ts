import RoomController from "../Domain/Controller/RoomController";
import { ROOM_TYPE } from "../Enum/Enum";
import { Socket } from "socket.io";

module.exports = (socket: Socket) => {

    const roomController = new RoomController(socket);

    //ルーム作成
    const createRoom = async (name: string, user_id: string) => {
        await roomController.createRoom(name, user_id, ROOM_TYPE.talkroom);
    };

    //ダイレクトメッセージルーム情報送信
    const requireUsers = async (user_id: string) => {
        await roomController.getDirectMessageRoomInfo(user_id, socket);
    }

    //入室権限があるルーム情報のデータを送信
    const requireRooms = async (user_id: string) => {
        await roomController.getTalkRooms(user_id);
    };

    socket.on('user:create-room',createRoom);
    socket.on('user:require-members',requireUsers);
    socket.on('user:require-rooms',requireRooms);
}