import Exception from "../Exception/Exception";
import User from "../User/User";
import LoginManager from '../User/LoginManager';

class UserController{
    private loginManager: LoginManager;
    constructor(){
        this.loginManager = new LoginManager();
    }
    async registe(name: string,credentials: Credentials){
        const user: User = new User(name,credentials);
        if(await user.registe()){

        }
        throw new Exception();
    }
    async login(name: string,credentials: Credentials){
        if(await this.loginManager.login(credentials)){

        }
    }
    async logout(credentials: Credentials){
        if(await this.loginManager.logout(credentials)){
            
        }
    }
    async authenticate(credentials: Credentials){
        if(await this.loginManager.authenticate(credentials)){
            
        }
    }
}
export default new UserController();