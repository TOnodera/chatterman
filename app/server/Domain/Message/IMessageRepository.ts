import Message from './Message';
interface IMessageRepository{
    add(message: Message): Promise<boolean>;
    delete(message_id: string): Promise<boolean>;
    save(message: Message): Promise<boolean>;
    all(room_id: string): Promise<{messages?:Message[],exists: boolean}>;
    get(message_id: string): Promise<{message?: Message,exists: boolean}>;
}
export default IMessageRepository;