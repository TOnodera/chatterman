import Message from "server/Domain/Message/Message";
import IRoom from "server/Domain/Room/Interface/IRoom";
import Room from "server/Domain/Room/Room";
import { Socket } from "socket.io";
import Datetime from "../../../Utility/Datetime";
import IUserRepository from "../Repository/IUserRepository";

interface IUser {
    id: string;
    credentials: Credentials;
    name: string;
    created_at: Datetime;
    repository: IUserRepository;

    message(socket: Socket): Message;
    room(): IRoom;
}

export default IUser;