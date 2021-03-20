import IUserRepository from './IUserRepository';
class UserRepositoryFactory{
    static create(): IUserRepository{
        throw new Exception('Not implements...',500);
    }
}
export default UserRepositoryFactory;