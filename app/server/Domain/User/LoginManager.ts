import ILoginManager from "./ILoginManager";
import IUserRepository from "./IUserRepository";
import UserRepositoryFactory from "./UserRepositoryFactory";
import loginUserStore from '../../Store/LoginUsersStore'
import User from "./User";

class LoginManager implements ILoginManager{
    repository: IUserRepository;
    constructor(){
        this.repository = UserRepositoryFactory.create();
    }
    async login(credentials: Credentials): Promise<boolean> {
        if(this.repository.credentials(credentials)){
            const user: User = await this.repository.getUserByCredentials(credentials);
            loginUserStore.enqueue(user);
            return true;            
        }
        return false;
    }
    async logout(credentials: Credentials): Promise<boolean> {
        if(await this.repository.credentials(credentials)){
            return true;
        }
        return false;
    }
    authenticate(credentials: Credentials): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
export default LoginManager;