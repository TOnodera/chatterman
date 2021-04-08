import { Socket } from 'socket.io';
import MessageController from '../Controller/MessasgeController';
import Config from '../../config';

class NotifyManager extends MessageController{

    constructor(socket: Socket){
        super(socket);
    }

    async sendNoticeMessage(message: string,room_id: string){
        await this.add(message,Config.system.superuser,room_id);
    }
}

export default NotifyManager;