import IMessageRepository from './IMessageRepository';
import MessageEditor from '../Message';
import Exception from '../../Exception/Exception';
import Datetime from '../../Utility/Datetime';
import MessageRegister from '../MessageRegister';
import MessageFactory from '../Factory/MessageFactory';
import { query } from '../../Utility/Connection/Connection';
import logger from '../../Utility/logger';

class MessageRepository implements IMessageRepository {
    async latest(room_id: string, nums: number): Promise<any[]> {
        const [rows]: any[] = await query('SELECT id FROM messages WHERE room_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ?', [room_id, nums]);
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }

    async roomIncludeMessage(room_id: string, message_id: string): Promise<boolean> {
        const message: MessageEditor = await MessageFactory.create(message_id);
        return message.room_id == room_id;
    }

    async more(room_id: string, created_at: Datetime, nums: number): Promise<any[]> {
        const [rows]: any[] = await query('SELECT id FROM messages WHERE room_id = ? AND deleted_at IS NULL AND created_at < ? ORDER BY created_at DESC LIMIT ? ', [room_id, created_at.get(), nums]);
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }

    async add(message: MessageRegister): Promise<boolean> {
        const [result]: any[] = await query('INSERT INTO messages SET id = ?, user_id = ? ,room_id = ?, message = ? ,created_at = NOW()', [message.message_id, message.user.id, message.room_id, message.message]);
        return result.affectedRows == 1;
    }

    async delete(message_id: string): Promise<boolean> {
        const [result]: any[] = await query('UPDATE messages SET deleted_at = NOW() WHERE id = ?', [message_id]);
        return result.affectedRows == 1;
    }

    async get(message_id: string): Promise<any> {
        const [rows]: any[] = await query('SELECT * FROM messages WHERE id = ? LIMIT 1', [message_id]);
        if (rows.length > 0) {
            return rows[0];
        }
        throw new Exception(`メッセージが見つかりませんでした。 message_id: ${message_id}`);
    }

    async save(message: MessageEditor): Promise<boolean> {
        const [result]: any[] = await query('UPDATE messages SET message = ? WHERE id = ? ', [message.message, message.message_id]);
        return result.affectedRows == 1;
    }

    async hasMessage(message: MessageEditor): Promise<boolean> {
        const [rows]: any[] = await query('SELECT * FROM messages WHERE user_id = ? AND id = ?', [message.user?.id, message.message_id]);
        return rows.length > 0;
    }
}

export default MessageRepository;
