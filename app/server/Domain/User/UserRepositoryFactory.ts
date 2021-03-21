import IUserRepository from './IUserRepository';
import UserRepository from './UserRepository';
class UserRepositoryFactory{
    static create(): IUserRepository{
        switch(true){
            default:
                return new UserRepository();
        }
    }
}
export default UserRepositoryFactory;