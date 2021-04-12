import UserFactory from '../../User/Factory/UserFactory';
import User from '../../User/User';
import Datetime from '../../Utility/Datetime';
import logger from '../../Utility/logger';
import Message from '../Message';
import MessageRepositoryFactory from './MessageRepositoryFactory';
import findMessageOption from '../FindMessageOption';

class MessageFactory {
    static async create(id: string): Promise<Message> {

        const repository = MessageRepositoryFactory.create();
        const result: any = await repository.get(id);
        const user: User = await UserFactory.create(result.user_id);

        //オプションメッセージが付加されていたらその情報も取得
        if(result.unique_id){
            const options: ApproveOptions = await findMessageOption.getMessageOptionById(result.unique_id);
            logger.debug(options);
            return new Message(result.id, result.message, user, result.room_id, new Datetime(result.created_at), options);
        }

        return new Message(result.id, result.message, user, result.room_id, new Datetime(result.created_at));

    }
}

export default MessageFactory;