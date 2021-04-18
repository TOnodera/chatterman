import logger from '../Utility/logger';
import { Socket } from 'socket.io';
import MessageController from '../Controller/MessasgeController';
import socketService from '../Utility/SocketService';

module.exports = (socket: Socket) => {
    const messageController = new MessageController(socket);

    const userSendMessage = async (fromClient: any) => {
        await messageController.add(fromClient.message, fromClient.user.id, fromClient.room_id);
    };

    const userEditMessage = async (fromClient: any) => {
        console.log('userSendMessage...');
    };

    const deleteMessage = (fromClient: any) => {
        console.log('deleteMessage...');
    };

    const userTyping = (user: { id: string; name: string }, room_id: string) => {
        messageController.typing(user, room_id);
    };

    const moreMessages = (room_id: string, message_id: string) => {
        logger.info('追加メッセージ送信要求を受信 room_id -> ', room_id);
        messageController.moreMessages(room_id, message_id);
    };

    const latestMessages = (room_id: string) => {
        logger.info('新規メッセージ送信要求を受信 room_id -> ', room_id);
        messageController.getLatest(room_id);
    };

    socketService.registeOnce('user:send-message', userSendMessage, socket);
    socketService.registeOnce('user:edit-message', userEditMessage, socket);
    socketService.registeOnce('user:delete-message', deleteMessage, socket);
    socketService.registeOnce('user:typing', userTyping, socket);
    socketService.registeOnce('user:latest-messages', latestMessages, socket);
    socketService.registeOnce('user:more-messages', moreMessages, socket);
};
