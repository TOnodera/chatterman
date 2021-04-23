import UserMessage from '../Domain/Message/UserMessage';
import { Socket } from 'socket.io';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';
import IUserEditor from '../Domain/User/Interface/IUserEditor';
import UserFactory from '../Domain/User/Factory/UserFactory';
import MessageRegister from '../Domain/Message/MessageRegister';
import IMessageRegister from '../Domain/Message/Interface/IMessageRegister';
import logger from '../Utility/logger';


class MessageController {
    private socket: Socket;
    private message: UserMessage;

    constructor(socket: Socket) {
        this.socket = socket;
        this.message = new UserMessage(socket);
    }

    //TODO パッケージ間の依存関係整理するときにuserそのまま入れるメソッドをコントローラー以外のところに作る
    async add(message: string, user_id: string, room_id: string) {
        const user: IUserEditor = await UserFactory.create(user_id);
        const messageRegister: IMessageRegister = new MessageRegister(message, user, room_id);
        this.message.send(messageRegister).catch((e) => {
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
