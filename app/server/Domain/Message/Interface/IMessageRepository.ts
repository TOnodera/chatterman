import Datetime from '../../../Utility/Datetime';
import MessageEditor from '../MessageEditor';
import MessageRegister from '../MessageRegister';
interface IMessageRepository {
    add(message: MessageRegister): Promise<boolean>;
    delete(message_id: string): Promise<boolean>;
    save(message: MessageEditor): Promise<boolean>;
    latest(room_id: string, nums: number): Promise<any[]>;
    more(room_id: string, created_at: Datetime, nums: number): Promise<any[]>;
    get(message_id: string): Promise<MessageEditor>;
    hasMessage(message: MessageEditor): Promise<boolean>;
}
export default IMessageRepository;
