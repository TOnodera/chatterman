import User from '../User/User';
import UserFactory from '../User/Factory/UserFactory';
import MessageRegister from './MessageRegister';
import MessageFactory from './Factory/MessageFactory';
import Datetime from '../Utility/Datetime';
import MessageEditor from './MessageEditor';
import logger from '../Utility/logger';
import polymorphicManager from '../Polymorphic/PolymorphicManager';
import { transaction } from '../Utility/Connection/Connection';
class MessageService {
    /**
     *
     * @param strMessage
     * @param user_id
     * @param room_id
     * メッセージ登録
     */
    async add(strMessage: string, user_id: string, room_id: string): Promise<string> {
        const user: User = await UserFactory.create(user_id);
        const message: MessageRegister = new MessageRegister(strMessage, user, room_id);
        const message_id: string = await message.add();

        return message_id;
    }

    async get(message_id: string): Promise<MessageEditor> {
        const message: MessageEditor = await MessageFactory.create(message_id);
        return message;
    }

    async registe(message: string, user_id: string, room_id: string, options?: MessageOptions): Promise<SendMessageToClient> {

        const [toClient]: SendMessageToClient[] = await transaction(
            async (): Promise<SendMessageToClient[]> => {
                const message_id: string = await this.add(message, user_id, room_id);

                if (options) {
                    //ポリモーフィック関連テーブルに登録する
                    await this.addPolymorphic(message_id, options);
                }

                //データ取得して返す
                const registeredNow: MessageEditor = await this.get(message_id);
                const toClient: SendMessageToClient[] = await this.toClient([registeredNow]);

                return toClient;
            }
        );

        return toClient;

    }

    /**
     *
     * @param message_id
     * @param options
     * メッセージに付加情報を付けて送る場合はここで付加情報を保存する
     */
    async addPolymorphic(message_id: string, options: MessageOptions): Promise<boolean> {
        return polymorphicManager.save(message_id, options);
    }

    /**
     *
     * @param message_id
     * 登録日時を取得
     */
    async getCreatedAt(message_id: string): Promise<Datetime> {
        const message: MessageEditor = await this.get(message_id);
        return message.created_at;
    }

    /**
     *
     * @param messages
     * メッセージオブジェクトにはUserオブジェクトが含まれていてbroadcast配信する必要のないデータがある。
     * 送信に必要なデータだけここでピックアップして送る。
     */
    toClient(messages: MessageEditor[]): SendMessageToClient[] {
        let toClient: SendMessageToClient[] = [];
        for (let message of messages) {
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
