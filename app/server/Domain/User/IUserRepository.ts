import User from './User';
interface IUserRepository{
    registe(user: User): Promise<boolean | void>;
    getUserByEmail(email: string): Promise<User | void>;
    getUserByPassword(plainPassword: string): Promise<User | void>;
    getUserByName(name: string): Promise<User | void>;
    getUserByCredentials(credentials: Credentials): Promise<User | void>;
    hasMessage(message: Message): Promise<boolean | void>;
}
export default IUserRepository;