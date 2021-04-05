import RoomController from "../Domain/Controller/RoomController";
import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';
import { RoomType, UserRegisteInfo } from "server/@types/types";

module.exports = (io: any) => {
  io.on('connection', (socket: Socket) => {

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
      const roomType: RoomType = {Type: 'talkroom'};
      await RoomController.createRoom(name,user_id,roomType,socket);
    };

    //ユーザーデータ送信
    const requireUsers = async () => {
      await UserController.getUsers(socket);
    }

    //入室権限があるルーム情報のデータを送信
    const requireRooms = async (user_id: string) => {
      await RoomController.getAllRooms(user_id,socket);
    };

    //ハンドラ登録
    socket.on('user:after-login', afterLogin);
    socket.on('user:logout',userLogout);
    socket.on('user:create-room',createRoom);
    socket.on('user:require-users',requireUsers);
    socket.on('user:require-rooms',requireRooms);
  });
}
