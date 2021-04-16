import AuthenticationException from '../Exception/AuthenticationException';
import Exception from '../Exception/Exception';
import User from '../User/User';
import Datetime from '../Utility/Datetime';
import IMessageRepository from './Repository/IMessageRepository';
import MessageRepositoryFactory from './Factory/MessageRepositoryFactory';

class Message {
    private repository: IMessageRepository;
    message_id: string;
    message: string;
    user: User;
    room_id: string;
    options?: Options;
    created_at: Datetime;

    constructor(message_id: string, message: string, user: User, room_id: string, created_at: Datetime, options?: Options) {
        this.repository = MessageRepositoryFactory.create();
        this.message_id = message_id;
        this.message = message;
        this.user = user;
        this.room_id = room_id;
        this.created_at = created_at;
        this.options = options;
    }

    async edit(newMessage: string): Promise<boolean> {
        if ((await this.user.isEditable(this)) == false) {
            throw new AuthenticationException('このメッセージを編集できません。');
        }
        this.message = newMessage;
        return await this.repository.save(this);
    }

    async delete(): Promise<boolean> {
        if (!this.message_id) {
            throw new Exception('message_idがない状態でdelete()は呼び出せません。');
        }
        return await this.repository.delete(this.message_id);
    }
}
export default Message;
