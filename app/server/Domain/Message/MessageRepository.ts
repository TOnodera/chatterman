import IMessageRepository from './IMessageRepository';
import Message from './Message';
import UserRepositoryFactory from '../User/UserRepositoryFactory';
import Exception from '../Exception/Exception';
import Datetime from '../Utility/Datetime';
import UserFactory from '../User/UserFactory';
import User from '../User/User';

class MessageRepository implements IMessageRepository {

    private connector;
    private userRepository;
    private nums: number;
    
    constructor(connector: any) {
        this.connector = connector;
        this.userRepository = UserRepositoryFactory.create();
        this.nums = 20;
    }

    async latest(room_id: string): Promise<Message[]> {
        const [rows]: any[] = await this.connector.query('SELECT * FROM messages WHERE room_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ?', [room_id,this.nums]);
        console.log('in message repository',room_id);
        
        if (rows.length > 0) {
            const messages: Message[] = [];
            for (let row of rows) {
                const  message: Message = new Message(row.message_id);
                if(await message.load()){
                    messages.push(message);                    
                }
            }
            return messages.reverse();
        }
        return [];
    }

    async getCreatedAt(message_id: string): Promise<Datetime>{
        const {message,exists} = await this.get(message_id);
        if(exists){
            return message?.created_at as Datetime;
        }
        throw new Exception('想定外のエラー: messageにcreated_atがありません。');
    }

    async roomIncludeMessage(room_id: string,message_id: string): Promise<boolean>{
        const {message,exists} = await this.get(message_id);
        if(exists){
            if(message?.room_id == room_id){
                return true;
            }
        }
        return false;
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
                const  message: Message = new Message(row.message_id);
                if(await message.load()){
                    messages.push(message);                    
                }
            }
            return messages.reverse();
        }else{
            return [];
        }
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
            const user: User = await UserFactory.create(result[0].user_id);
            const message =  new Message(result[0].message, user, result[0].room_id);
            message.created_at = new Datetime(result[0].created_at);
            return { message: message, exists: true };
            
        }
        return { exists: false };
    }

    async save(message: Message): Promise<boolean> {
        const [result] = await this.connector.query('UPDATE messages SET message = ? WHERE message_id = ? ', [message.message, message.message_id]);
        return result.affectedRows == 1;
    }
    
}

export default MessageRepository;