import User from "../User/User";
import IMessageRepository from './IMessageRepository';
import MessageRepository from './MessageRepository';

class Message{
    private repository: IMessageRepository;
    message_id?: string;
    message: string;
    user: User;
    room_id: string;
    
    constructor(message: string,user: User,room_id: string){
        this.message = message;
        this.user = user;
        this.room_id = room_id;
        this.repository = new MessageRepository();
    }
}
export default Message;