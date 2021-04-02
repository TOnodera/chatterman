import RoomController from "../Domain/Controller/RoomController";
import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';

module.exports = (io: any) => {
  io.on('connection', (socket: Socket) => {

    //ユーザー登録
    const userRegister = async (fromClient: UserRegisteInfo) => {
      await UserController.registe(fromClient, socket);
    };

    //ログイン
    const userLogin = async (credendtials: Credentials) => {
      await UserController.login(credendtials,socket);
    };

    //ログアウト
    const userLogout = async (credentials: Credentials) => {
      await UserController.logout(credentials,socket);
    };

    //ルーム作成
    const createRoom = async (name: string,user_id: string) => {
      await RoomController.createRoom(name,user_id,socket);
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
    socket.on('user:register', userRegister);
    socket.on('user:attempt-login', userLogin);
    socket.on('user:logout',userLogout);
    socket.on('user:create-room',createRoom);
    socket.on('user:require-users',requireUsers);
    socket.on('user:require-rooms',requireRooms);
  });
}
