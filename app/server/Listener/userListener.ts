import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';

module.exports = (io: any) => {
  io.on('connection', (socket: Socket) => {

    //ユーザー登録
    const userRegister = async (fromClient: UserRegisteInfo) => {
      await UserController.registe(fromClient, socket);
      socket.emit('user:registered','登録が完了しました。ログインして下さい。');
    };

    //ログイン
    const userLogin = async (credendtials: Credentials) => {
      await UserController.login(credendtials,socket);
    };

    //ハンドラ登録
    socket.on('user:register', userRegister);
    socket.on('user:attempt-login', userLogin);
    
  });
}
