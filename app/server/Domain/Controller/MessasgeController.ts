import messages from '../Message/Messages';
import { Socket } from "socket.io";
import { SendMessageToClient } from "server/@types/types";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import logger from "../Utility/logger";
import messageManager from '../Message/MessasgeManager';
import MessageEventEmitter from '../Message/MessageEventEmitter';

class MessageController {

    private socket: Socket;
    private messageEventEmitter: MessageEventEmitter;

    constructor(socket: Socket){
        this.socket = socket;
        this.messageEventEmitter = new MessageEventEmitter(socket);
    }

    async add(strMessage: string, user_id: string, room_id: string) {

        logger.info(`1/2 MessageController.add -> 送信処理開始:user_id->${user_id},socket_id:${this.socket.id}`);

        try{

            const toClient: SendMessageToClient = await messageManager.add(strMessage,user_id,room_id);

            this.messageEventEmitter.broadcastUserSendMessageEvent(room_id,toClient);
            this.messageEventEmitter.sendUserSendMessageEvent(toClient);

        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }

        logger.info(`2/2 MessageController.add -> 送信処理完了:user_id->${user_id},socket_id:${this.socket.id}`);

    }

    delete(): void {

    }

    edit(): void {

    }

    typing(user: { id: string, name: string }, room_id: string): void {
        this.messageEventEmitter.broadcastUserTypingEvent(user.name,room_id);
    }

    async moreMessages(room_id: string, message_id: string) {

        logger.info(`1/2 MessageController.moreMessages() -> 追加メッセージ送信要求 room_id: ${room_id}, message_id: ${message_id},socket_id: ${this.socket.id}`);

        try {

            const response: SendMessageToClient[] = await messages.more(room_id, message_id);
            this.messageEventEmitter.sendSendMessagesDataEvent(response);

        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }

        logger.info(`2/2 MessageController.moreMessages() -> 送信完了 room_id: ${room_id}, message_id: ${message_id},socket_id: ${this.socket.id}`);

    }

    async getLatest(room_id: string) {

        logger.info(`1/2 MessageController.getLatest() -> 新規メッセージ送信要求 room_id: ${room_id}, socket_id: ${this.socket.id}`);

        try {
            
            const response: SendMessageToClient[] = await messages.latest(room_id);
            this.messageEventEmitter.sendSendLatestMessagesEvent(response);

        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }

        logger.info(`2/2 MessageController.getLatest() -> 送信完了 room_id: ${room_id}, socket_id: ${this.socket.id}`);

    }

}

export default MessageController;