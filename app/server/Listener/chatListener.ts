import { Socket } from "socket.io";
import UserController from '../Domain/Controller/UserController';


module.exports = (io: any) => {
    io.on('connection', (socket: Socket) => {

        const userLogin = async (fromClient: any) => {

            console.log("userLogin...");
            //UserController.login(fromClient.name,{email:fromClient.email,password: fromClient.password});

        };

        const userLogout = (fromClient: any) => {

            console.log('userLogout...');
            //UserController.logout(fromClient.name,{email:fromClient.email,password: fromClient.password});

        };

        const userSendMessage = async (fromClient: any) => {

            console.log('userSendMessage...');

        };

        const userEditMessage = async (fromClient: any) => {

            console.log('userSendMessage...');

        };

        const deleteMessage = (fromClient: any) => {

            console.log('deleteMessage...');

        };

        socket.on('user:login', userLogin);
        socket.on('user:logout', userLogout);
        socket.on('user:send-message', userSendMessage);
        socket.on('user:edit-message', userEditMessage);
        socket.on('user:delete-message', deleteMessage);

    });
}
