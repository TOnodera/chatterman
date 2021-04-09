import { SendMessageToClient } from 'server/@types/types';
import IMessageRepository from './Repository/IMessageRepository';
import Message from './Message';
import MessageRepositoryFactory from './Factory/MessageRepositoryFactory';

class Messages{

    private repository : IMessageRepository;

    constructor(){
        this.repository = MessageRepositoryFactory.create();
    }

    async latest(room_id: string): Promise<SendMessageToClient[]> {
        const result = await this.repository.latest(room_id);
        return this.toClient(result); 
    }

    async more(room_id: string,message_id: string): Promise<SendMessageToClient[]> {
        const result = await this.repository.more(room_id,message_id);
        return await this.toClient(result);
    }

    toClient(messages: Message[]): SendMessageToClient[]{
        let toClient: SendMessageToClient[] = [];
        for(let message of messages){
            const client: SendMessageToClient = {
                room_id: message.room_id as string,
                user_id: message.user?.id as string,
                user_name: message.user?.name as string,
                message_id: message.message_id as string,
                message: message.message as string,
                created_at: message.created_at?.get() as string
            };
            toClient.push(client);
        }
        return toClient;
    }

}

export default new Messages();