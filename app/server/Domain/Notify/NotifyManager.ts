import { Socket } from 'socket.io';
import Config from '../../Config';
import MessageEventEmitter from '../Message/MessageEventEmitter';
import MessageService from '../Message/MessaseService';

class NotifyManager {

    private messageEventEmitter: MessageEventEmitter;

    constructor(socket: Socket) {
        this.messageEventEmitter = new MessageEventEmitter(socket);
    }

    async sendNoticeMessage(message: string, room_id: string, options?: MessageOptions) {

        const toClient: SendMessageToClient = await MessageService.registe(message, Config.system.superuser, room_id, options);
        this.messageEventEmitter.broadcastUserSendMessageEvent(room_id, toClient);

    }
}

export default NotifyManager;
