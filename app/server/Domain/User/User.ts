import Datetime from '../../Utility/Datetime';
import IUserRepository from './Repository/IUserRepository';
import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import IUser from './Interface/IUser';
import IRoom from '../Room/Interface/IRoom';
import Room from '../Room/Room';
import Message from '../Message/Message';
import UserMessage from '../Message/UserMessage';
import { Socket } from 'socket.io';
import ApplyManager from '../Apply/ApplyManager';
import IMessage from '../Message/Interface/IMessage';

class User implements IUser {

    id: string;
    credentials: Credentials;
    name: string;
    created_at: Datetime;
    repository: IUserRepository;

    constructor(id: string, name: string, credentials: Credentials, created_at: string) {
        this.id = id;
        this.name = name;
        this.credentials = credentials;
        this.created_at = new Datetime(created_at);
        this.repository = UserRepositoryFactory.create();
    }

    apply(socket: Socket): ApplyManager {
        return new ApplyManager(socket, this);
    }

    message(socket: Socket): IMessage {
        return new UserMessage(socket);
    }

    room(): IRoom {
        return new Room(this);
    }

}

export default User;
