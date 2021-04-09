import IMessageRepository from './IMessageRepository';
import Message from '../Message';
import Exception from '../../Exception/Exception';
import Datetime from '../../Utility/Datetime';
import UserFactory from '../../User/Factory/UserFactory';
import User from '../../User/User';
import MessageRegister from '../MessageRegister';
import MessageFactory from '../Factory/MessageFactory';

class MessageRepository implements IMessageRepository {

    private connector;
    private nums: number;
    
    constructor(connector: any) {
        this.connector = connector;
        this.nums = 20;
    }

    async latest(room_id: string): Promise<Message[]> {
        const [rows]: any[] = await this.connector.query('SELECT * FROM messages WHERE room_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ?', [room_id,this.nums]);
        
        if (rows.length > 0) {
            const messages: Message[] = [];
            for (let row of rows) {
                const  message: Message = await MessageFactory.create(row.id);
                messages.push(message);                    
            }
            return messages.reverse();
        }

        return [];
    }

    async getCreatedAt(message_id: string): Promise<Datetime>{
        const message: Message = await MessageFactory.create(message_id);
        return message.created_at;
    }

    async roomIncludeMessage(room_id: string,message_id: string): Promise<boolean>{
        const message: Message = await MessageFactory.create(message_id);
        return message.room_id == room_id;
    }

    async more(room_id: string,message_id: string): Promise<Message[]>{
        if(await this.roomIncludeMessage(room_id,message_id) == false){
            throw new Exception(`指定されたルームに${message_id}のメッセージは存在しません。`);
        }
        const created_at = await this.getCreatedAt(message_id);
        const [rows]: any[] = await this.connector.query('SELECT * FROM messages WHERE room_id = ? AND deleted_at IS NULL AND created_at < ? ORDER BY created_at DESC LIMIT ? ', [room_id,created_at.get(),this.nums]);
        if (rows.length > 0) {
            const messages: Message[] = [];
            for (let row of rows) {
                const  message: Message = await MessageFactory.create(row.id);
                messages.push(message);                    
            }
            return messages.reverse();
        }else{
            return [];
        }
    }

    async add(message: MessageRegister): Promise<boolean> {
        const [result]: any[] = await this.connector.query('INSERT INTO messages SET id = ?, user_id = ? ,room_id = ?, message = ? ,created_at = NOW()', [message.message_id, message.user.id, message.room_id, message.message]);
        return result.affectedRows == 1;
    }

    async delete(message_id: string): Promise<boolean> {
        const [result]: any[] = await this.connector.query('UPDATE messages SET deleted_at = NOW() WHERE id = ?', [message_id]);
        return result.affectedRows == 1;
    }

    async get(message_id: string): Promise<Message> {
        const [rows]: any[] = await this.connector.query('SELECT * FROM messages WHERE id = ? LIMIT 1', [message_id]);
        if (rows.length > 0) {
            const result: any = rows[0];
            const user: User = await UserFactory.create(result.user_id);
            return new Message(
                result.id,
                result.message,
                user,
                result.room_id,
                new Datetime(result.created_at)
            );
        }
        throw new Exception(`メッセージが見つかりませんでした。 message_id: ${message_id}`);        
    }

    async save(message: Message): Promise<boolean> {
        const [result] = await this.connector.query('UPDATE messages SET message = ? WHERE id = ? ', [message.message, message.message_id]);
        return result.affectedRows == 1;
    }
    
}

export default MessageRepository;