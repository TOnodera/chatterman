import IMessageEditor from "./IMessageEditor";
import IMessageRegister from "./IMessageRegister";

interface IMessage {
    registe(messageRegister: IMessageRegister, options?: MessageOptions): Promise<SendMessageToClient>;
    send(messageRegister: IMessageRegister, options?: MessageOptions): Promise<void>;
    get(message_id: string): Promise<IMessageEditor>;
    typing(user: { id: string; name: string }, room_id: string): void;
    more(room_id: string, message_id: string): Promise<void>;
    latest(room_id: string): Promise<void>;
}

export default IMessage;