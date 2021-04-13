import RoomController from "../Domain/Controller/RoomController";
import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';
import { ROOM_TYPE } from "../enum/enum";

module.exports =  (socket: Socket) => {

    const roomController = new RoomController(socket);

    //ログイン直後
    const afterLogin = async (credendtials: Credentials) => {
      await UserController.afterCredentials(credendtials,socket);
    };

    //ログアウト
    const userLogout = async (id: string,credentials: Credentials) => {
      await UserController.logout(id,credentials,socket);
    };

    //ルーム作成
    const createRoom = async (name: string,user_id: string) => {
      await roomController.createRoom(name,user_id,ROOM_TYPE.talkroom);
    };

    //ダイレクトメッセージルーム情報送信
    const requireUsers = async (user_id: string) => {
      await UserController.getDirectMessageRoomInfo(user_id,socket);
    }

    //入室権限があるルーム情報のデータを送信
    const requireRooms = async (user_id: string) => {
      await roomController.getTalkRooms(user_id);
    };

    

    //ハンドラ登録
    socket.on('user:after-login', afterLogin);
    socket.on('user:logout',userLogout);
    socket.on('user:create-room',createRoom);
    socket.on('user:require-members',requireUsers);
    socket.on('user:require-rooms',requireRooms);

}
