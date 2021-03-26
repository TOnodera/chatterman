
import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';

module.exports = (io : any) => {
  io.on('connection', (socket: Socket) => {

    const userRegister = async (fromClient: any) => {

        console.log("userRegister...");
        //UserController.registe(fromClient.name,{email: fromClient.email,password: fromClient.password});

    };

    socket.on('user:registe',userRegister);
  });
}
