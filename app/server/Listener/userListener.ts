import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';

module.exports = (io: any) => {
  io.on('connection', (socket: Socket) => {
    const userRegister = async (fromClient: UserRegisteInfo) => {
      await UserController.registe(fromClient, socket);
    };
    socket.on('user:register', userRegister);
  });
}
