import UserFactory from '../../User/Factory/UserFactory';
import User from '../../User/User';
import Datetime from '../../Utility/Datetime';
import logger from '../../Utility/logger';
import MessageEditor from '../Message';
import MessageRepositoryFactory from './MessageRepositoryFactory';
import polymorphicManager from '../../Polymorphic/PolymorphicManager';

class MessageFactory {
    static async create(message_id: string): Promise<MessageEditor> {
        const repository = MessageRepositoryFactory.create();
        const result: any = await repository.get(message_id);
        const user: User = await UserFactory.create(result.user_id);

        //オプションメッセージが付加されていたらその情報も取得
        const options: ApproveOptions | null = await polymorphicManager.getMessageApproveOptionByMessageId(message_id);

        return options ? new MessageEditor(result.id, result.message, user, result.room_id, new Datetime(result.created_at), options) : new MessageEditor(result.id, result.message, user, result.room_id, new Datetime(result.created_at));
    }
}

export default MessageFactory;
