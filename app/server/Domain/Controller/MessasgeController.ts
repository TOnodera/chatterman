import messages from '../Message/Messages';
import { Socket } from "socket.io";
import { SendMessageToClient } from "server/@types/types";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import logger from "../Utility/logger";
import messageManager from '../Message/MessasgeManager';
import Config from '../../config';

class MessageController {

    async add(strMessage: string, user_id: string, room_id: string, socket: Socket) {

        logger.info(`1/2 MessageController.add -> 送信処理開始:user_id->${user_id},socket_id:${socket.id}`);

        try{

            const toClient: SendMessageToClient = await messageManager.add(strMessage,user_id,room_id);
            socket.to(room_id).emit('broadcast:user-send-message', toClient);
            socket.emit('broadcast:user-send-message', toClient);

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }

        logger.info(`2/2 MessageController.add -> 送信処理完了:user_id->${user_id},socket_id:${socket.id}`);

    }

    delete(): void {

    }

    edit(): void {

    }

    typing(user: { id: string, name: string }, room_id: string, socket: Socket): void {
        socket.broadcast.emit('broadcast:user-typing',{ user_name: user.name,room_id: room_id });
    }

    async moreMessages(room_id: string, message_id: string, socket: Socket) {

        logger.info(`1/2 MessageController.moreMessages() -> 追加メッセージ送信要求 room_id: ${room_id}, message_id: ${message_id},socket_id: ${socket.id}`);

        try {

            const response: SendMessageToClient[] = await messages.more(room_id, message_id);
            socket.emit('user:send-messages-data', response);

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }

        logger.info(`2/2 MessageController.moreMessages() -> 送信完了 room_id: ${room_id}, message_id: ${message_id},socket_id: ${socket.id}`);

    }

    async getLatest(room_id: string, socket: Socket) {

        logger.info(`1/2 MessageController.getLatest() -> 新規メッセージ送信要求 room_id: ${room_id}, socket_id: ${socket.id}`);

        try {
            
            const response: SendMessageToClient[] = await messages.latest(room_id);
            socket.emit('user:send-latest-messages', response);

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }

        logger.info(`2/2 MessageController.getLatest() -> 送信完了 room_id: ${room_id}, socket_id: ${socket.id}`);

    }

}

const messageController = new MessageController;
export {
    MessageController,
    messageController
}