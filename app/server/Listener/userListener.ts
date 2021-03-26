
import { Socket } from "socket.io";

module.exports = (io : any) => {
  io.on('connection', (socket: Socket) => {

    const userRegister = async (fromClient: any) => {

        console.log("userRegister...");

    };

    socket.on('user:registe',userRegister);
  });
}
