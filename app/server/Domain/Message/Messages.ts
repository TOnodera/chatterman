import IMessageRepository from './IMessageRepository';
import Message from './Message';
import MessageRepositoryFactory from './MessageRepositoryFactory';

class Messages{

    private repository : IMessageRepository;

    constructor(){
        this.repository = MessageRepositoryFactory.create();
    }

    async all(room_id: string): Promise<{messages?:Message[],exists: boolean}> {
        const {messages,exists} = await this.repository.all(room_id);
        return exists
        ? {messages: messages,exists: true}
        : {exists: false};
    }

}

export default new Messages();