import ExceptionHandler from "../Domain/Exception/ExceptionHandler";
import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';

module.exports = (io: any) => {
  io.on('connection', (socket: Socket) => {

    const userRegister = async (fromClient: any) => {
      
      const registeInfo: UserRegisteInfo = {
        name: fromClient.name,
        credentials: {
          email: fromClient.credentials.email,
          password: fromClient.credentials.password
        }
      };

      await UserController.registe(registeInfo, socket);

    };

    socket.on('user:register', userRegister);
  });
}
