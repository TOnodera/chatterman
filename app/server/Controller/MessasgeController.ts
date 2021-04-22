import UserMessage from '../Domain/Message/UserMessage';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';


class MessageController {
    private socket: Socket;
    private message: UserMessage;

    constructor(socket: Socket) {
        this.socket = socket;
        this.message = new UserMessage(socket);
    }

    async add(message: string, user_id: string, room_id: string) {
        this.message.send(message, user_id, room_id).catch((e) => {
            SocketExceptionHandler.handle(e, this.socket);
        });
    }

    delete(): void { }

    edit(): void { }

    typing(user: { id: string; name: string }, room_id: string): void {
        this.message.typing(user, room_id);
    }

    async more(room_id: string, message_id: string) {
        this.message.more(room_id, message_id).catch((e) => {
            SocketExceptionHandler.handle(e, this.socket);
        });
    }

    async latest(room_id: string) {
        this.message.latest(room_id).catch((e) => {
            SocketExceptionHandler.handle(e, this.socket);
        });
    }
}

export default MessageController;
