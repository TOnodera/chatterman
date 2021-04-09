import messages from '../Message/Messages';
import { Socket } from "socket.io";
import { MessageOptions, SendMessageToClient } from "server/@types/types";
import logger from "../Utility/logger";
import MessageService from '../Message/MessaseService';
import MessageEventEmitter from '../Message/MessageEventEmitter';
import { transaction } from '../Utility/Connection';

class MessageManager {

    private socket: Socket;
    private messageEventEmitter: MessageEventEmitter;

    constructor(socket: Socket) {
        this.socket = socket;
        this.messageEventEmitter = new MessageEventEmitter(socket);
    }

    async add(message: string, user_id: string, room_id: string, options?: MessageOptions) {

        logger.info(`1/2 MessageManager.add -> 送信処理開始:user_id->${user_id},socket_id:${this.socket.id}`);

        const [toClient]: SendMessageToClient[] = await transaction(async ():Promise<SendMessageToClient[]> => {

            const toClient: SendMessageToClient = await MessageService.add(message, user_id, room_id);

            if (options) {
                //ポリモーフィック関連テーブルに登録する
                await MessageService.addPolymorphic(toClient.message_id, options);
            }

            return [toClient];

        });

        this.messageEventEmitter.broadcastUserSendMessageEvent(room_id, toClient, options);
        this.messageEventEmitter.sendUserSendMessageEvent(toClient, options);

        logger.info(`2/2 MessageManager.add -> 送信処理完了:user_id->${user_id},socket_id:${this.socket.id}`);

    }

    delete(): void {

    }

    edit(): void {

    }

    typing(user: { id: string, name: string }, room_id: string): void {
        this.messageEventEmitter.broadcastUserTypingEvent(user.name, room_id);
    }

    async moreMessages(room_id: string, message_id: string) {

        logger.info(`1/2 MessageManager.moreMessages() -> 追加メッセージ送信要求 room_id: ${room_id}, message_id: ${message_id},socket_id: ${this.socket.id}`);

        const response: SendMessageToClient[] = await messages.more(room_id, message_id);
        this.messageEventEmitter.sendSendMessagesDataEvent(response);

        logger.info(`2/2 MessageManager.moreMessages() -> 送信完了 room_id: ${room_id}, message_id: ${message_id},socket_id: ${this.socket.id}`);

    }

    async getLatest(room_id: string) {

        logger.info(`1/2 MessageManager.getLatest() -> 新規メッセージ送信要求 room_id: ${room_id}, socket_id: ${this.socket.id}`);

        const response: SendMessageToClient[] = await messages.latest(room_id);
        this.messageEventEmitter.sendSendLatestMessagesEvent(response);

        logger.info(`2/2 MessageManager.getLatest() -> 送信完了 room_id: ${room_id}, socket_id: ${this.socket.id}`);

    }

}

export default MessageManager;