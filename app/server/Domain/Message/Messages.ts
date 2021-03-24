import IMessageRepository from './IMessageRepository';
import Message from './Message';
import MessageRepository from './MessageRepository';

class Messages{
    private repository : IMessageRepository;
    constructor(){
        this.repository = new MessageRepository();
    }
    all(): Message[]{
        
    }
    more(): Message[]{

    }
    search(): Message[]{

    }
}