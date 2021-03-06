import AuthenticationException from '../../Exception/AuthenticationException';
import Exception from '../../Exception/Exception';
import Datetime from '../../Utility/Datetime';
import IMessageRepository from './Interface/IMessageRepository';
import MessageRepositoryFactory from './Factory/MessageRepositoryFactory';
import IUser from '../User/Interface/IUser';
import IMessageEditor from './Interface/IMessageEditor';


/**
 * 既存メッセージを扱うクラス
 */
class MessageEditor implements IMessageEditor {

    private repository: IMessageRepository;
    message_id: string;
    message: string;
    user: IUser;
    room_id: string;
    options?: Options;
    created_at: Datetime;

    constructor(message_id: string, message: string, user: IUser, room_id: string, created_at: Datetime, options?: Options) {
        this.repository = MessageRepositoryFactory.create();
        this.message_id = message_id;
        this.message = message;
        this.user = user;
        this.room_id = room_id;
        this.created_at = created_at;
        this.options = options;
    }

    async edit(newMessage: string): Promise<boolean> {
        if ((await this.isEditable(this)) == false) {
            throw new AuthenticationException('このメッセージを編集できません。');
        }
        this.message = newMessage;
        return await this.repository.save(this);
    }

    async isEditable(message: IMessageEditor): Promise<boolean> {
        return await this.repository.hasMessage(message);
    }

    async delete(): Promise<boolean> {
        if (!this.message_id) {
            throw new Exception('message_idがない状態でdelete()は呼び出せません。');
        }
        if ((await this.isEditable(this)) == false) {
            throw new AuthenticationException('このメッセージを編集できません。');
        }
        return await this.repository.delete(this.message_id);
    }
}
export default MessageEditor;
