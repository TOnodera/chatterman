import User from './User';
import Message from '../Message/Message';
interface IUserRepository{
    registe(user: User): Promise<boolean>;
    thisEmailIsAlreadyUsed(email: string): Promise<boolean>;
    thisNameIsAlreadyUsed(name: string): Promise<boolean>;
    getUserByCredentials(credentials: Credentials): Promise<User>;
    credentials(credentials: Credentials): Promise<boolean>;
    hasMessage(message: Message): Promise<boolean>;
    get(id: string): Promise<{user?: User,exists: boolean}>;
    getUsers(): Promise<Client[]>;
}
export default IUserRepository;