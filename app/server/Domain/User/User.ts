import Datetime from '../Utility/Datetime';
import IUserRepository from './IUserRepository';
import UserRepositoryFactory from './UserRepositoryFactory';
import Message from '../Message/Message';
import room from '../Room/RoomRepository';

class User {

    id: string;
    credentials: Credentials;
    name: string;
    created_at: Datetime;
    repository: IUserRepository;

    constructor(id: string,name: string, credentials: Credentials,created_at: string) {
        this.id = id;
        this.name = name;
        this.credentials = credentials;
        this.created_at = new Datetime(created_at);
        this.repository = UserRepositoryFactory.create();
    }   

    getId(): string{
        return this.id;
    }

    async isAccessable(user_id: string,room_id: string): Promise<boolean> {
        return await room.isAccessAbleRooms(user_id,room_id);
    }

    async isEditable(message: Message): Promise<boolean> {
        return await this.repository.hasMessage(message);
    }
}

export default User;