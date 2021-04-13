import MessageRepository from '../Repository/MessageRepository';
class MessageRepositoryFactory{
    static create(){
        return new MessageRepository();
    }
}
export default MessageRepositoryFactory;