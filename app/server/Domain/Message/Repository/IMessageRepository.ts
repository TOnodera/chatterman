import Message from '../Message';
import MessageRegister from '../MessageRegister';
interface IMessageRepository{
    add(message: MessageRegister): Promise<boolean>;
    delete(message_id: string): Promise<boolean>;
    save(message: Message): Promise<boolean>;
    latest(room_id: string,nums: number): Promise<string[]>;
    more(room_id: string,message_id: string,nums: number): Promise<Message[]>;
    get(message_id: string): Promise<Message>;
}
export default IMessageRepository;