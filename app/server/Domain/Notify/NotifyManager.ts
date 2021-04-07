import { Socket } from 'socket.io';
import { MessageController } from '../Controller/MessasgeController';
import Config from '../../config';

class NotifyManager extends MessageController{
    async sendNoticeMessage(message: string,room_id: string,socket: Socket){
        await this.add(message,Config.system.superuser,room_id,socket);
    }
}

export default new NotifyManager;