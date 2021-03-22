import ILoginManager from "./ILoginManager";
import IUserRepository from "./IUserRepository";
import UserRepositoryFactory from "./UserRepositoryFactory";

class LoginManager implements ILoginManager{
    repository: IUserRepository;
    constructor(){
        this.repository = UserRepositoryFactory.create();
    }
    async login(credentials: Credentials): Promise<boolean> {
        return this.repository.credentials(credentials);
    }
    logout(credentials: Credentials): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    authenticate(credentials: Credentials): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
export default LoginManager;