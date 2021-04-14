import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import userManager from '../User/UserManager';
import userEventEmitter from '../User/UserEventEmitter';
import Exception from '../Exception/Exception';

class UserController {

    private loginManager: any;

    constructor() {
        this.loginManager = LoginManager;
    }

    async registe(fromClient: UserRegisteInfo){
        await userManager.registe(fromClient);       
    }

    async afterCredentials(credentials: Credentials, socket: Socket) {
        this.loginManager.afterCredentials(credentials,socket).catch((e: Exception)=>{SocketExceptionHandler.handle(e,socket)});;
    }

    async logout(id: string, credentials: Credentials, socket: Socket) {
        try {
            if (await this.loginManager.logout(credentials,socket)) {
                socket.request.session.credentials = { email: '', password: '' };
                return;
            }
            userEventEmitter.sendLogoutFailureEvent(id,socket);
        } catch (e) {
            SocketExceptionHandler.handle(e, socket);
        }
    }

    async authenticate(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.authenticate(credentials)) {
            
        }
    }

}
export default new UserController();