import IUserRepository from './IUserRepository';
import User from './User';
class UserRepository implements IUserRepository{
    registe(user: User): boolean {
        throw new Error('Method not implemented.');
    }
    getUserByEmail(email: string): User {
        throw new Error('Method not implemented.');
    }
    getUserByPassword(plainPassword: string): User {
        throw new Error('Method not implemented.');
    }
    getUserByName(name: string): User {
        throw new Error('Method not implemented.');
    }
    hasMessage(message: Message): boolean {
        throw new Error('Method not implemented.');
    }
    
}
export default UserRepository;