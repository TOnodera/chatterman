import User from "../User/User";
import { MessageOptions, SendMessageToClient } from "server/@types/types";
import UserFactory from "../User/Factory/UserFactory";
import MessageRegister from "./MessageRegister";
import MessageFactory from "./Factory/MessageFactory";
import { transaction } from '../Utility/Connection';
import MessageOptionsRepositoryFactory from './Factory/MessageOptionsRepositoryFactory';
import IMessageOptionsRepository from "./Repository/IMessageOptionsRepository";
import Datetime from "../Utility/Datetime";
import Message from "./Message";

class MessageService {

    /**
     * 
     * @param strMessage 
     * @param user_id 
     * @param room_id 
     * メッセージ登録
     */
    async add(strMessage: string, user_id: string, room_id: string): Promise<SendMessageToClient> {

        const [result]: SendMessageToClient[] = await transaction(async () => {

            const user: User = await UserFactory.create(user_id);
            const message: MessageRegister = new MessageRegister(strMessage, user, room_id);
            const message_id: string = await message.add();
            const registered = await MessageFactory.create(message_id);

            const toClient: SendMessageToClient = {
                room_id: room_id,
                user_id: user_id,
                user_name: registered.user.name,
                message_id: registered.message_id,
                message: strMessage,
                created_at: registered.created_at.get()
            };
            return [toClient];
        });
        return result;

    }

    /**
     * 
     * @param message_id 
     * @param options 
     * メッセージに付加情報を付けて送る場合はここで付加情報を保存する
     */
    async addPolymorphic(message_id: string, options: MessageOptions): Promise<boolean> {
        const reposiotry: IMessageOptionsRepository = MessageOptionsRepositoryFactory.create();
        return reposiotry.add(message_id, options);
    }

    /**
     * 
     * @param message_id 
     * 登録日時を取得
     */
    async getCreatedAt(message_id: string): Promise<Datetime> {
        const message: Message = await MessageFactory.create(message_id);
        return message.created_at;
    }
}
export default new MessageService();