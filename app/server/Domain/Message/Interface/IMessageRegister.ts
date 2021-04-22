import IUserEditor from "../../../Domain/User/Interface/IUserEditor";

interface IMessageRegister {
    message_id: string;
    message: string;
    user: IUserEditor;
    room_id: string;
    registe(): Promise<string>;
}

export default IMessageRegister;