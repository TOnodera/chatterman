import IMessageRepository from './IMessageRepository';
import Message from '../Message';
import Exception from '../../Exception/Exception';
import Datetime from '../../Utility/Datetime';
import MessageRegister from '../MessageRegister';
import MessageFactory from '../Factory/MessageFactory';
import { Pool } from 'mysql2/promise';

class MessageRepository implements IMessageRepository {

    private connector;
    
    constructor(connector: Pool) {
        this.connector = connector;
    }

    async latest(room_id: string,nums: number): Promise<Message[]> {
        const [rows]: any[] = await this.connector.query('SELECT id FROM messages WHERE room_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ?', [room_id,nums]);
        
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

    async more(room_id: string,message_id: string,nums: number): Promise<Message[]>{
        if(await this.roomIncludeMessage(room_id,message_id) == false){
            throw new Exception(`指定されたルームに${message_id}のメッセージは存在しません。`);
        }
        const created_at = await this.getCreatedAt(message_id);
        const [rows]: any[] = await this.connector.query('SELECT id FROM messages WHERE room_id = ? AND deleted_at IS NULL AND created_at < ? ORDER BY created_at DESC LIMIT ? ', [room_id,created_at.get(),nums]);
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


    async get(message_id: string): Promise<any> {

         const [rows]: any[] = await this.connector.query('SELECT messages.*,message_polymorphics.id as unique_id FROM messages LEFT JOIN message_polymorphics ON message_polymorphics.message_id = messages.id WHERE messages.id = ? LIMIT 1', [message_id]);
         if (rows.length > 0) {
             return rows[0];
         }
         throw new Exception(`メッセージが見つかりませんでした。 message_id: ${message_id}`);        
    }

    async save(message: Message): Promise<boolean> {
        const [result]: any[] = await this.connector.query('UPDATE messages SET message = ? WHERE id = ? ', [message.message, message.message_id]);
        return result.affectedRows == 1;
    }
    
}

export default MessageRepository;