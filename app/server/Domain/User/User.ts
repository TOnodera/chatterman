import Datetime from '../Utility/Datetime';
import IUserRepository from './Repository/IUserRepository';
import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import Message from '../Message/Message';
import roomManager from '../Room/RoomManager';

class User {
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

    getId(): string {
        return this.id;
    }

    async isAccessable(room_id: string): Promise<boolean> {
        return await roomManager.isAccessableRooms(this.id, room_id);
    }

    async accessAbleRooms(): Promise<string[]> {
        const rooms: string[] = await roomManager.getAccessableRooms(this.id);
        return rooms;
    }

    async isEditable(message: Message): Promise<boolean> {
        return await this.repository.hasMessage(message);
    }
}

export default User;
