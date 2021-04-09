import IUserRepository from '../Repository/IUserRepository';
import UserRepository from '../UserRepository';
import { mySqlConnector } from '../../Utility/Connection';
class UserRepositoryFactory{
    static create(): IUserRepository{
        return new UserRepository(mySqlConnector);
    }
}
export default UserRepositoryFactory;