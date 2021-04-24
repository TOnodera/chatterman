import IUser from "../../../Domain/User/Interface/IUser";

interface IMessageRegister {
    message_id: string;
    message: string;
    user: IUser;
    room_id: string;
    registe(): Promise<string>;
}

export default IMessageRegister;