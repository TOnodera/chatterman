import User from "../User/User";
import UserFactory from "../User/Factory/UserFactory";
import MessageRegister from "./MessageRegister";
import MessageFactory from "./Factory/MessageFactory";
import { transaction } from '../Utility/Connection';
import MessageOptionsRepositoryFactory from './Factory/MessageOptionsRepositoryFactory';
import IMessageOptionsRepository from "./Repository/IMessageOptionsRepository";
import Datetime from "../Utility/Datetime";
import Message from "./Message";
import logger from "../Utility/logger";

class MessageService {

    /**
     * 
     * @param strMessage 
     * @param user_id 
     * @param room_id 
     * メッセージ登録
     */
    async add(strMessage: string, user_id: string, room_id: string): Promise<string> {

        const [message_id]: string[] = await transaction(async () => {

            const user: User = await UserFactory.create(user_id);
            const message: MessageRegister = new MessageRegister(strMessage, user, room_id);
            const message_id: string = await message.add();
            
            return [message_id];
        });

        return message_id;
    }

    async get(message_id: string): Promise<Message>{
        const message: Message = await MessageFactory.create(message_id);
        return message;
    }

    /**
     * 
     * @param message_id 
     * @param options 
     * メッセージに付加情報を付けて送る場合はここで付加情報を保存する
     */
    async addPolymorphic(message_id: string, options: MessageOptions): Promise<boolean> {
        const reposiotry: IMessageOptionsRepository = MessageOptionsRepositoryFactory.create();
        logger.debug("addPolymorphic()",message_id,options);
        return reposiotry.add(message_id, options);
    }

    /**
     * 
     * @param message_id 
     * 登録日時を取得
     */
    async getCreatedAt(message_id: string): Promise<Datetime> {
        const message: Message = await this.get(message_id);
        return message.created_at;
    }

    /**
     * 
     * @param messages 
     * メッセージオブジェクトにはUserオブジェクトが含まれていてbroadcast配信する必要のないデータがある。
     * 送信に必要なデータだけここでピックアップして送る。
     */
    toClient(messages: Message[]): SendMessageToClient[]{
        let toClient: SendMessageToClient[] = [];
        for(let message of messages){
            const client: SendMessageToClient = {
                room_id: message.room_id,
                user_id: message.user.id,
                user_name: message.user.name,
                message_id: message.message_id,
                message: message.message,
                created_at: message.created_at.get(),
                options: message.options
            };
            toClient.push(client);
        }
        return toClient;
    }
}
export default new MessageService();