import { MessageOptions } from "server/@types/types";

interface IMessageOptionsRepository{
    add(message_id: string,messageOption: MessageOptions): Promise<boolean>;
}

export default IMessageOptionsRepository;