import IMessage from "server/Domain/Message/Interface/IMessage";
import Message from "server/Domain/Message/Message";
import IRoom from "../../../Domain/Room/Interface/IRoom";
import { Socket } from "socket.io";
import Datetime from "../../../Utility/Datetime";
import IUserRepository from "../Repository/IUserRepository";
import ApplyManager from "server/Domain/Apply/ApplyManager";
import { USER_TYPE } from "server/Enum/Enum";

interface IUser {
    id: string;
    credentials: Credentials;
    name: string;
    created_at: Datetime;
    type: USER_TYPE;
    repository: IUserRepository;

    apply(socket: Socket): ApplyManager;
    message(socket: Socket): IMessage;
    room(): IRoom;
}

export default IUser;