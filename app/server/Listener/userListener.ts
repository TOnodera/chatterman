import { deprecationHandler } from "moment";
import ExceptionHandler from "server/Domain/Exception/ExceptionHandler";
import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';
import roomManager from '../Domain/Room/RoomManager';

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
      console.log('create-room called...');
      await roomManager.createRoom(name,user_id,socket);
    };

    //ハンドラ登録
    socket.on('user:register', userRegister);
    socket.on('user:attempt-login', userLogin);
    socket.on('user:create-room',createRoom);
    
  });
}
