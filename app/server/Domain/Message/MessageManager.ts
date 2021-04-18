import messages from '../Message/Messages';
import { Socket } from 'socket.io';
import logger from '../Utility/logger';
import MessageService from '../Message/MessaseService';
import MessageEventEmitter from '../Message/MessageEventEmitter';
import { transaction } from '../Utility/Connection/Connection';
import Message from './Message';

/**
 * メッセージ管理クラス
 * 外部パッケージから使う場合はこのマネージャーを呼び出して使う
 * サービスとか直接触らない
 */
class MessageManager {
    private socket: Socket;
    private messageEventEmitter: MessageEventEmitter;

    constructor(socket: Socket) {
        this.socket = socket;
        this.messageEventEmitter = new MessageEventEmitter(socket);
    }

    async add(message: string, user_id: string, room_id: string, options?: MessageOptions) {
        logger.info(`1/2 MessageManager.add -> 送信処理開始:user_id->${user_id},socket_id:${this.socket.id}`);

        const toClient: SendMessageToClient = await MessageService.registe(message, user_id, room_id, options);

        this.messageEventEmitter.broadcastUserSendMessageEvent(room_id, toClient);
        this.messageEventEmitter.sendUserSendMessageEvent(toClient);

        logger.info(`2/2 MessageManager.add -> 送信処理完了:user_id->${user_id},socket_id:${this.socket.id}`);
    }

    delete(): void { }

    edit(): void { }

    typing(user: { id: string; name: string }, room_id: string): void {
        this.messageEventEmitter.broadcastUserTypingEvent(user.name, room_id);
    }

    async moreMessages(room_id: string, message_id: string) {
        logger.info(`1/2 MessageManager.moreMessages() -> 追加メッセージ送信要求 room_id: ${room_id}, message_id: ${message_id},socket_id: ${this.socket.id}`);
        const response: SendMessageToClient[] = await messages.more(room_id, message_id);
        if (response.length > 0) {
            this.messageEventEmitter.sendSendMessagesDataEvent(response);
        }
        logger.info(`2/2 MessageManager.moreMessages() -> 送信完了 room_id: ${room_id}, message_id: ${message_id},socket_id: ${this.socket.id}`);
    }

    async getLatest(room_id: string) {
        logger.info(`1/2 MessageManager.getLatest() -> 新規メッセージ送信要求 room_id: ${room_id}, socket_id: ${this.socket.id}`);

        const response: SendMessageToClient[] = await messages.latest(room_id);
        if (response.length > 0) {
            this.messageEventEmitter.sendSendLatestMessagesEvent(response);
        }

        logger.info(`2/2 MessageManager.getLatest() -> 送信完了 room_id: ${room_id}, socket_id: ${this.socket.id}`);
    }
}

export default MessageManager;
