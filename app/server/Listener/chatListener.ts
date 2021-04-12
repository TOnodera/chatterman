import logger from "../Domain/Utility/logger";
import { Socket } from "socket.io";
import MessageController from '../Domain/Controller/MessasgeController';
import RoomController from '../Domain/Controller/RoomController';

module.exports = (socket: Socket) => {

    const messageController = new MessageController(socket);
    const roomController = new RoomController(socket);

    const userSendMessage = async (fromClient: any) => {
        await messageController.add(fromClient.message, fromClient.user.id, fromClient.room_id);
    };

    const userEditMessage = async (fromClient: any) => {

        console.log('userSendMessage...');

    };

    const deleteMessage = (fromClient: any) => {

        console.log('deleteMessage...');

    };

    const attemptToEnter = async (info: RoomAndUserId) => {
        logger.info(`次のユーザーが入室しようとしました。 user:${info.user_id} -> room:${info.room_id}`);
        await roomController.attemptToEnter(info);
    };

    const leaveCurrentRoom = async (info: RoomAndUserId) => {
        await roomController.leaveCurrentRoom(info);
    }

    const userTyping = (user: { id: string, name: string },room_id: string) => {
        messageController.typing(user, room_id);
    };

    const moreMessages = (room_id: string, message_id: string) => {
        messageController.moreMessages(room_id, message_id);
    }

    const latestMessages = (room_id: string) => {
        logger.info('新規メッセージ送信要求を受信');
        messageController.getLatest(room_id);
    }

    socket.on('user:send-message', userSendMessage);
    socket.on('user:edit-message', userEditMessage);
    socket.on('user:delete-message', deleteMessage);
    socket.on('user:attempt-to-enter-room', attemptToEnter);
    socket.on('user:leave-room', leaveCurrentRoom);
    socket.on('user:typing', userTyping);
    socket.on('user:latest-messages', latestMessages);
    socket.on('user:more-messages', moreMessages);

};
