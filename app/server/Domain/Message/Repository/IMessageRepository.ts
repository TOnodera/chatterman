import Datetime from 'server/Domain/Utility/Datetime';
import Message from '../Message';
import MessageRegister from '../MessageRegister';
interface IMessageRepository {
    add(message: MessageRegister): Promise<boolean>;
    delete(message_id: string): Promise<boolean>;
    save(message: Message): Promise<boolean>;
    latest(room_id: string, nums: number): Promise<any[]>;
    more(room_id: string, created_at: Datetime, nums: number): Promise<any[]>;
    get(message_id: string): Promise<Message>;
    hasMessage(message: Message): Promise<boolean>;
}
export default IMessageRepository;
