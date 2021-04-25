import UserFactory from '../../User/Factory/UserFactory';
import User from '../../User/User';
import Datetime from '../../../Utility/Datetime';
import logger from '../../../Utility/logger';
import MessageEditor from '../MessageEditor';
import MessageRepositoryFactory from './MessageRepositoryFactory';
import polymorphicManager from '../../Polymorphic/PolymorphicManager';
import IMessageEditor from '../Interface/IMessageEditor';
import IUser from '../../../Domain/User/Interface/IUser';

class MessageFactory {
    static async create(message_id: string): Promise<IMessageEditor> {
        const repository = MessageRepositoryFactory.create();
        const result: any = await repository.get(message_id);
        const user: IUser = await UserFactory.create(result.user_id);

        //オプションメッセージが付加されていたらその情報も取得
        const options: ApproveOptions | null = await polymorphicManager.getMessageApproveOptionByMessageId(message_id);

        return options ? new MessageEditor(result.id, result.message, user, result.room_id, new Datetime(result.created_at), options) : new MessageEditor(result.id, result.message, user, result.room_id, new Datetime(result.created_at));
    }
}

export default MessageFactory;
