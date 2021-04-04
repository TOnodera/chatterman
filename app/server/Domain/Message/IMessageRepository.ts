import Message from './Message';
interface IMessageRepository{
    add(message: Message): Promise<boolean>;
    delete(message_id: string): Promise<boolean>;
    save(message: Message): Promise<boolean>;
    latest(room_id: string): Promise<Message[]>;
    more(room_id: string,message_id: string): Promise<Message[]>;
    get(message_id: string): Promise<{message?: Message,exists: boolean}>;
}
export default IMessageRepository;