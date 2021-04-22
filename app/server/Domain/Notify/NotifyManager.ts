/*
import { Socket } from 'socket.io';
import Config from '../../Config';
import MessageEventEmitter from '../Message/MessageEventEmitter';
import Message from '../Message/Message';

class NotifyManager {

    private messageEventEmitter: MessageEventEmitter;
    private socket: Socket;

    constructor(socket: Socket) {
        this.messageEventEmitter = new MessageEventEmitter(socket);
        this.socket = socket;
    }

    async sendNoticeMessage(message: string, room_id: string, options?: MessageOptions) {

        const messageObj: Message = new Message(this.socket);
        const toClient: SendMessageToClient = await messageObj.send(message, Config.system.superuser, room_id, options);
        this.messageEventEmitter.broadcastUserSendMessageEvent(room_id, toClient);

    }
}

export default NotifyManager;

削除対象です。


*/