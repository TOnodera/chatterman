import User from "../User/User";
import messages from '../Message/Messages';
import { Socket } from "socket.io";
import { SendMessageToClient } from "server/@types/types";
import UserFactory from "../User/UserFactory";
import MessageRegister from "../Message/MessageRegister";
import MessageFactory from "../Message/MessageFactory";
import { transaction } from '../Utility/Connection';
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import logger from "../Utility/logger";

class MessageController {

    async add(strMessage: string, user_id: string, room_id: string, socket: Socket) {

        try {

            logger.info(`1/6 MesageController -> add() メッセージ送信処理開始  message:${strMessage}, user_id: ${user_id},room_id: ${room_id},socket_id: ${socket.id}`);
            logger.info(`2/6 トランザクション開始: socket_id: ${socket.id}`);
            await transaction(async () => {

                const user: User = await UserFactory.create(user_id);
                const message: MessageRegister = new MessageRegister(strMessage, user, room_id);
                const message_id: string = await message.add();
                const registered = await MessageFactory.create(message_id);

                const toClient: SendMessageToClient = {
                    room_id: room_id,
                    user_id: user_id,
                    user_name: registered.user.name,
                    message_id: registered.message_id,
                    message: strMessage,
                    created_at: registered.created_at.get()
                };

            
                logger.info(`3/6 ブロードキャスト配信: socket_id: ${socket.id}`);
                socket.to(room_id).emit('broadcast:user-send-message', toClient);

                logger.info(`4/6 自分自身に配信: socket_id: ${socket.id}`);
                socket.emit('broadcast:user-send-message', toClient);
            

            });

            logger.info(`5/6 トランザクション完了: socket_id: ${socket.id}`);
            logger.info(`6/6 送信完了: socket_id: ${socket.id}`);

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }

    }
    delete(): void {

    }
    edit(): void {

    }

    typing(user: { id: string, name: string }, room_id: string, socket: Socket): void {
        socket.broadcast.emit('broadcast:user-typing',{ user_name: user.name,room_id: room_id });
    }

    async moreMessages(room_id: string, message_id: string, socket: Socket) {
        try {
            logger.info(`1/2 MessageController.moreMessages() -> 追加メッセージ送信要求 room_id: ${room_id}, message_id: ${message_id},socket_id: ${socket.id}`);
            const response: SendMessageToClient[] = await messages.more(room_id, message_id);
            socket.emit('user:send-messages-data', response);
            logger.info(`2/2 MessageController.moreMessages() -> 送信完了 room_id: ${room_id}, message_id: ${message_id},socket_id: ${socket.id}`);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async getLatest(room_id: string, socket: Socket) {
        try {
            logger.info(`1/2 MessageController.getLatest() -> 新規メッセージ送信要求 room_id: ${room_id}, socket_id: ${socket.id}`);
            const response: SendMessageToClient[] = await messages.latest(room_id);
            socket.emit('user:send-latest-messages', response);
            logger.info(`2/2 MessageController.getLatest() -> 送信完了 room_id: ${room_id}, socket_id: ${socket.id} count: ${response.length}`);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

}
export default new MessageController();