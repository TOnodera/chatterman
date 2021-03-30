import { Socket } from "socket.io";
import messageController from '../Domain/Controller/MessasgeController';
import User from "../Domain/User/User";
import roomController from '../Domain/Controller/RoomController';

module.exports = (io: any) => {
    io.on('connection', (socket: Socket) => {

        const userSendMessage = async (fromClient: any) => {
            await messageController.add(fromClient.message,fromClient.user.id,socket,fromClient.room_id);
        };

        const userEditMessage = async (fromClient: any) => {

            console.log('userSendMessage...');

        };

        const deleteMessage = (fromClient: any) => {

            console.log('deleteMessage...');

        };

        //テスト実装　動作するのを確認できたら別クラス(RoomManager?とか)で実装する
        const attemptToEnter = async (info: RoomAndUserId) => {
            await roomController.attemptToEnter(info,socket);
        };

        //上と同じ　テスト実装
        const leaveCurrentRoom = async (info: RoomAndUserId)=>{
            await roomController.leaveCurrentRoom(info,socket);
        }

        socket.on('user:send-message', userSendMessage);
        socket.on('user:edit-message', userEditMessage);
        socket.on('user:delete-message', deleteMessage);
        socket.on('user:attempt-to-enter-room', attemptToEnter);
        socket.on('user:leave-room',leaveCurrentRoom);

    });
}
