import User from "../User/User";
import messages from '../Message/Messages';
import { Socket } from "socket.io";
import { SendMessageToClient } from "server/@types/types";
import UserFactory from "../User/UserFactory";
import MessageRegister from "../Message/MessageRegister";
import MessageFactory from "../Message/MessageFactory";
import { transaction } from '../Utility/Connection';
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";

class MessageController {

    async add(strMessage: string, user_id: string, room_id: string, socket: Socket) {

        try {

            await transaction(async () => {

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

            
                //ブロードキャスト
                socket.to(room_id).emit('broadcast:user-send-message', toClient);
                //自分に送る
                socket.emit('broadcast:user-send-message', toClient);
            

            });

        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }

    }
    delete(): void {

    }
    edit(): void {

    }

    typing(user: { id: string, name: string }, socket: Socket): void {
        socket.broadcast.emit('broadcast:user-typing', user);
    }

    async moreMessages(room_id: string, message_id: string, socket: Socket) {
        try {
            const response: SendMessageToClient[] = await messages.more(room_id, message_id);
            socket.emit('user:send-messages-data', response);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async getLatest(room_id: string, sokcet: Socket) {
        try {
            const response: SendMessageToClient[] = await messages.latest(room_id);
            sokcet.emit('user:send-latest-messages', response);
        } catch (e) {
            SocketExceptionHandler.handle(e, sokcet);
        }
    }

}
export default new MessageController();