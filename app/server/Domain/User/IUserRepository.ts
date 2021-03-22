import User from './User';
interface IUserRepository{
    registe(user: User): Promise<boolean>;
    thisEmailIsAlreadyUsed(email: string): Promise<boolean>;
    thisNameIsAlreadyUsed(name: string): Promise<boolean>;
    getUserByCredentials(credentials: Credentials): Promise<User>;
    hasMessage(message: Message): Promise<boolean>;
}
export default IUserRepository;