import User from "../User/User";
import { SendMessageToClient } from "server/@types/types";
import UserFactory from "../User/UserFactory";
import MessageRegister from "./MessageRegister";
import MessageFactory from "./MessageFactory";
import { transaction } from '../Utility/Connection';

class MessageService {

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
}
export default new MessageService();