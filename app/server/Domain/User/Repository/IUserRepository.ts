import UserEditor from '../User';
import MessageEditor from '../../Message/MessageEditor';
import UserRegister from '../UserRegister';
interface IUserRepository {
    registe(user: UserRegister): Promise<boolean>;
    thisEmailIsAlreadyUsed(email: string): Promise<boolean>;
    thisNameIsAlreadyUsed(name: string): Promise<boolean>;
    getUserIdByCredentials(credentials: Credentials): Promise<string>;
    credentials(credentials: Credentials): Promise<boolean>;
    get(id: string): Promise<UserEditor>;
    getMembersId(user_id: string): Promise<string[]>;
}
export default IUserRepository;
