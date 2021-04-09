import logger from '../../Utility/logger';
import Message from '../Message';
import MessageRepositoryFactory from './MessageRepositoryFactory';
class MessageFactory{
    static async create(id: string): Promise<Message>{
       const repository = MessageRepositoryFactory.create();
       return await repository.get(id);
    }   
}

export default MessageFactory;