import Exception from "../Exception/Exception";
import User from "../User/User";
import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";

class UserController{
    private loginManager: LoginManager;
    constructor(){
        this.loginManager = new LoginManager();
    }
    async registe(fromClient: UserRegisteInfo,socket: Socket){
        const user: User = new User(fromClient.name,fromClient.credentials);
        await user.registe().catch((e: Exception)=>ExceptionHandler.handle(e,socket));
        socket.emit('user:registered');
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