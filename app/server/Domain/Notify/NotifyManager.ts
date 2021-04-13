import { Socket } from 'socket.io';
import Config from '../../config';
import MessageManager from '../Message/MessageManager';
import logger from '../Utility/logger';

class NotifyManager extends MessageManager {

    constructor(socket: Socket) {
        super(socket);
    }

    async sendNoticeMessage(message: string, room_id: string, options?: MessageOptions) {
        logger.debug("sendNoticeMessage",message,room_id);
        await this.add(message, Config.system.superuser, room_id, options);
    }
    
}

export default NotifyManager;