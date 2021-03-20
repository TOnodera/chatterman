import User from './User';
interface IUserRepository{
    registe(user: User): boolean;
    getUserByEmail(email: string): User;
    getUserByPassword(plainPassword: string): User;
    getUserByName(name: string): User;
    hasMessage(message: Message): boolean;
}
export default IUserRepository;