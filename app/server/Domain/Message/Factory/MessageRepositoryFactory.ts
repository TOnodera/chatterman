import { mySqlConnector } from '../../Utility/Connection';
import MessageRepository from '../Repository/MessageRepository';
class MessageRepositoryFactory{
    static create(){
        return new MessageRepository(mySqlConnector);
    }
}
export default MessageRepositoryFactory;