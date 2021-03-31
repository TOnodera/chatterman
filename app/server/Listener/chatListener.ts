import { Socket } from "socket.io";
import messageController from '../Domain/Controller/MessasgeController';
import roomController from '../Domain/Controller/RoomController';

module.exports = (io: any) => {
    io.on('connection', (socket: Socket) => {

        const userSendMessage = async (fromClient: any) => {
            console.log("through controller...");
            await messageController.add(fromClient.message,fromClient.user.id,socket,fromClient.room_id);
            console.log("in chat listener...",socket.rooms);
        };

        const userEditMessage = async (fromClient: any) => {

            console.log('userSendMessage...');

        };

        const deleteMessage = (fromClient: any) => {

            console.log('deleteMessage...');

        };

        const attemptToEnter = async (info: RoomAndUserId) => {
            await roomController.attemptToEnter(info,socket);
        };

        const leaveCurrentRoom = async (info: RoomAndUserId)=>{
            await roomController.leaveCurrentRoom(info,socket);
        }

        const userTyping = ()=>{
            messageController.typing(socket);
        };

        socket.on('user:send-message', userSendMessage);
        socket.on('user:edit-message', userEditMessage);
        socket.on('user:delete-message', deleteMessage);
        socket.on('user:attempt-to-enter-room', attemptToEnter);
        socket.on('user:leave-room',leaveCurrentRoom);
        socket.on('user:typing',userTyping);

    });
}
