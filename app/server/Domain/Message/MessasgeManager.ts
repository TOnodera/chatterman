import User from "../User/User";
import messages from '../Message/Messages';
import { Socket } from "socket.io";
import { SendMessageToClient } from "server/@types/types";
import UserFactory from "../User/UserFactory";
import MessageRegister from "../Message/MessageRegister";
import MessageFactory from "../Message/MessageFactory";
import { transaction } from '../Utility/Connection';
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import logger from "../Utility/logger";

class MessageManager {

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

    delete(): void {

    }
    edit(): void {

    }

    typing(user: { id: string, name: string }, room_id: string, socket: Socket): void {
        socket.broadcast.emit('broadcast:user-typing',{ user_name: user.name,room_id: room_id });
    }

    async moreMessages(room_id: string, message_id: string, socket: Socket) {

        try {
            const response: SendMessageToClient[] = await messages.more(room_id, message_id);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
            return false;
        }
        
        return true;

    }

    async getLatest(room_id: string, socket: Socket) {
        try {
            const response: SendMessageToClient[] = await messages.latest(room_id);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
            return false;
        }
        return true;
    }

}
export default new MessageManager();