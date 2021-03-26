
import { Socket } from "socket.io";

module.exports = (io : any) => {
  io.on('connection', (socket: Socket) => {

    const userLogin = async (fromClient: any) => {

        console.log("userLogin...");

    };
   
    const userSendMessage = async (fromClient: any) => {

        console.log('userSendMessage...');

    };

    const userEditMessage = async (fromClient: any) => {

        console.log('userSendMessage...');

    };

    const deleteMessage = (fromClient : any) => {

        console.log('deleteMessage...');

    };

    socket.on('user:login', userLogin);
    socket.on('user:send-message', userSendMessage);
    socket.on('user:delete-message',deleteMessage);
  });
}
