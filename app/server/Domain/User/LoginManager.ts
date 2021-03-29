import ILoginManager from "./ILoginManager";
import IUserRepository from "./IUserRepository";
import UserRepositoryFactory from "./UserRepositoryFactory";
import loginUserStore from '../../Store/LoginUsersStore'
import User from "./User";
import Exception from "../Exception/Exception";

class LoginManager implements ILoginManager{

    repository: IUserRepository;

    constructor(){
        this.repository = UserRepositoryFactory.create();
    }

    async login(credentials: Credentials): Promise<{user?: User,success: boolean}> {
        if(await this.repository.credentials(credentials)){
            const user: User = await this.repository.getUserByCredentials(credentials);
            loginUserStore.enqueue(user);
            return {user: user,success: true};            
        }
        return {success: false};
    }

    async logout(credentials: Credentials): Promise<boolean> {
        if(await this.repository.credentials(credentials)){
            const user: User = await this.repository.getUserByCredentials(credentials);
            if(user.id){
                loginUserStore.delete(user.id);
                return true;
            }
            throw new Exception('原因不明のエラーが発生しました。');
        }
        return false;
    }

    async authenticate(credentials: Credentials): Promise<boolean> {
        return await this.repository.credentials(credentials);
    }
    
}
export default LoginManager;