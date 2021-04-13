import IUserRepository from '../Repository/IUserRepository';
import UserRepository from '../Repository/UserRepository';
class UserRepositoryFactory{
    static create(): IUserRepository{
        return new UserRepository();
    }
}
export default UserRepositoryFactory;