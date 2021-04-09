import IUserRepository from '../Repository/IUserRepository';
import UserRepository from '../Repository/UserRepository';
import { mySqlConnector } from '../../Utility/Connection';
class UserRepositoryFactory{
    static create(): IUserRepository{
        return new UserRepository(mySqlConnector);
    }
}
export default UserRepositoryFactory;