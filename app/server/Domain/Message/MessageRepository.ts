import IMessageRepository from './IMessageRepository';
import Message from './Message';
import UserRepositoryFactory from '../User/UserRepositoryFactory';
import User from '../User/User';
import Exception from '../Exception/Exception';

class MessageRepository implements IMessageRepository {

    private connector;
    private userRepository;
    constructor(connector: any) {
        this.connector = connector;
        this.userRepository = UserRepositoryFactory.create();
    }

    async all(room_id: string): Promise<{ messages?: Message[], exists: boolean }> {
        const [rows]: any[] = this.connector.query('SELECT * FROM messages WHERE room_id = ? AND deleted_at IS NULL', [room_id]);
        if (rows.length > 0) {
            const messages: Message[] = [];
            for (let row of rows) {
                //TODO ボトルネックになるのでリファクタリングする
                const {user,exists}: {user?:User,exists: boolean} = await this.userRepository.get(row.user_id);
                if(exists){
                    const  message: Message = new Message(row.message_id);
                    if(await message.load()){
                        messages.push(message);                    
                    }
                }
            }
            return {messages: messages,exists: true};
        }
        return {exists: false};
    }

    async add(message: Message): Promise<boolean> {
        if(message.message_id && message.user && message.room_id){
            const [result]: any[] = await this.connector.query('INSERT INTO messages SET message_id = ?, user_id = ? ,room_id = ?, message = ? ,created_at = NOW()', [message.message_id, message.user.id, message.room_id, message.message]);
            return result.affectedRows == 1;
        }
        throw new Exception('message_id,user,room_idのいずれかが設定されない状態で呼び出されました。');
    }

    async delete(message_id: string): Promise<boolean> {
        const [result]: any[] = await this.connector.query('UPDATE messages SET deleted_at = NOW() WHERE message_id = ?', [message_id]);
        return result.affectedRows == 1;
    }

    async get(message_id: string): Promise<{ message?: Message, exists: boolean }> {
        const [result]: any[] = await this.connector.query('SELECT * FROM messages WHERE message_id = ? LIMIT 1', [message_id]);
        if (result.length > 0) {
            //ユーザーが見つからない場合はメッセージ返さない
            const { user, exists } = await this.userRepository.get(result[0].user_id);
            if (exists) {
                return { message: new Message(result[0].message, user!, result[0].room_id), exists: true };
            }
        }
        return { exists: false };
    }

    async save(message: Message): Promise<boolean> {
        const [result] = await this.connector.query('UPDATE messages SET message = ? WHERE message_id = ? ', [message.message, message.message_id]);
        return result.affectedRows == 1;
    }
    
}

export default MessageRepository;