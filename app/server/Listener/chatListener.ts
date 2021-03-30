import { Socket } from "socket.io";
import messageController from '../Domain/Controller/MessasgeController';
import User from "../Domain/User/User";
//仮実装用
import user from '../Domain/User/User';

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
        const attemptToEnter = async (info: any) => {
            const user: User = new User(info.user_id);
            await user.load();
            if(await user.isAccessable(info.room_id)){
                socket.join(info.room_id);
                socket.emit('user:join-room',info.room_id);
                console.log('send user:join-room',info.room_id);
                return;
            }
            socket.emit('user:denied-to-enter-room');
            console.log('send user:denied-to-enter-room');
        };

        //上と同じ　テスト実装
        const leaveCurrentRoom = async (info: any)=>{
            const user: User = new User(info.user_id);
            await user.load();
            if(await user.isAccessable(info.room_id)){
                socket.leave(info.room_id);
                socket.emit('user:left-room',info.room_id);
                console.log('send user:left-room',info.room_id);
                return;
            }
        }

        socket.on('user:send-message', userSendMessage);
        socket.on('user:edit-message', userEditMessage);
        socket.on('user:delete-message', deleteMessage);
        socket.on('user:attempt-to-enter-room', attemptToEnter);
        socket.on('user:leave-room',leaveCurrentRoom);

    });
}
