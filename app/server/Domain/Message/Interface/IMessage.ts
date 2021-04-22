import IMessageEditor from "./IMessageEditor";
import IMessageRegister from "./IMessageRegister";

interface IMessage {
    registe(messageRegister: IMessageRegister, options?: MessageOptions): Promise<SendMessageToClient>;
    send(messageRegister: IMessageRegister, options?: MessageOptions): Promise<void>;
    get(message_id: string): Promise<IMessageEditor>;
}

export default IMessage;