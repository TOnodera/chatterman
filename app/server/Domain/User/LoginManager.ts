import ILoginManager from "./ILoginManager";
import IUserRepository from "./IUserRepository";
import UserRepositoryFactory from "./UserRepositoryFactory";
import loginUserStore from '../../Store/LoginUsersStore'
import User from "./User";
import AuthenticationException from "../Exception/AuthenticationException";

class LoginManager implements ILoginManager{

    repository: IUserRepository;

    constructor(){
        this.repository = UserRepositoryFactory.create();
    }

    async login(credentials: Credentials): Promise<User> {
        if(await this.repository.credentials(credentials)){
            const user: User = await this.repository.getUserByCredentials(credentials);
            loginUserStore.enqueue(user);
            return user;   
        }
        throw new AuthenticationException('登録して下さい。');
    }

    async logout(credentials: Credentials): Promise<boolean> {
        console.log(credentials);
        if(await this.repository.credentials(credentials)){
            console.log(1);
            const user: User = await this.repository.getUserByCredentials(credentials);
            if(user.id){
                console.log(2);
                loginUserStore.delete(user.id);
                return true;
            }
        }
        return false;        
    }

    async authenticate(credentials: Credentials): Promise<boolean> {
        return await this.repository.credentials(credentials);
    }
    
}
export default LoginManager;