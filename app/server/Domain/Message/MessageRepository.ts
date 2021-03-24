import IMessageRepository from './IMessageRepository';
import Message from './Message';
import UserRepositoryFactory from '../User/UserRepositoryFactory';
import User from '../User/User';

class MessageRepository implements IMessageRepository{
    private connector;
    private userRepository;
    constructor(connector: any){
        this.connector = connector;
        this.userRepository = UserRepositoryFactory.create();
    }
    async add(message: Message): Promise<boolean> {
        const [result]: any[] = await this.connector.query('INSERT INTO MESSAGES SET message_id = ?, user_id = ? ,message = ? ,created_at = NOW()',[message.message_id,message.user.id,message.message]);
        return result.affectedRows == 1;
    }
    async delete(message_id: string): Promise<boolean> {
        const [result]: any[] = await this.connector.query('UPDATE FROM MESSAGES SET deleted_at = NOW() WHERE message_id = ?',[message_id]);
        return result.affectedRows == 1;
    }
    async get(message_id: string): Promise<{message?:Message,exists: boolean}> {
        const [result]: any[] = await this.connector.query('SELECT * FROM MESSAGES WHERE message_id = ? LIMIT 1',[message_id]);
        if(result.length>0){
            //ユーザーが見つからない場合はメッセージ返さない
            const {user,exists} = await this.userRepository.get(result[0].id);
            if(exists){
                return {message:new Message(result[0].message,user!,result[0].room_id),exists: true};
            }
        }
        return {exists: false};
    }
    async save(message: Message): Promise<boolean> {
        const [result] = await this.connector.query('UPDATE MESSAGES SET message = ? WHERE message_id = ? ',[message.message,message.message_id]);
        return result.affectedRows == 1;
    }
    all(room_id: string): Promise<Message[]> {
        
    }
}
export default MessageRepository;