import Message from './Message';
import MessageRegister from './MessageRegister';
interface IMessageRepository{
    add(message: MessageRegister): Promise<boolean>;
    delete(message_id: string): Promise<boolean>;
    save(message: Message): Promise<boolean>;
    latest(room_id: string): Promise<Message[]>;
    more(room_id: string,message_id: string): Promise<Message[]>;
    get(message_id: string): Promise<Message>;
}
export default IMessageRepository;