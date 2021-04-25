import Datetime from '../../Utility/Datetime';
import IUserRepository from './Repository/IUserRepository';
import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import IUser from './Interface/IUser';
import IRoom from '../Room/Interface/IRoom';
import Room from '../Room/Room';
import UserMessage from '../Message/UserMessage';
import { Socket } from 'socket.io';
import ApplyManager from '../Apply/ApplyManager';
import IMessage from '../Message/Interface/IMessage';
import { USER_TYPE } from '../../Enum/Enum';

class SystemUser implements IUser {

    id: string;
    credentials: Credentials;
    name: string;
    created_at: Datetime;
    type: USER_TYPE;
    repository: IUserRepository;

    constructor(id: string, name: string, credentials: Credentials, type: USER_TYPE, created_at: string) {
        this.id = id;
        this.name = name;
        this.credentials = credentials;
        this.type = type;
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

export default SystemUser;
