import Datetime from '../Utility/Datetime';
import IUserRepository from './Repository/IUserRepository';
import UserRepositoryFactory from './Factory/UserRepositoryFactory';

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
}

export default User;
