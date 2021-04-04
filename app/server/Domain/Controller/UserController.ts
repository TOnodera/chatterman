import LoginManager from '../User/LoginManager';
import { Socket } from "socket.io";
import ExceptionHandler from "../Exception/ExceptionHandler";
import roomManager from "../Room/RoomManager";
import userService from '../User/Service';
import DomainException from "../Exception/DomainException";
import { Client, UserRegisteInfo } from "server/@types/types";
import UserRegister from "../User/UserRegister";
import Exception from "../Exception/Exception";
import {transaction} from '../Utility/Connection';

class UserController {

    private loginManager: LoginManager;

    constructor() {
        this.loginManager = new LoginManager();
    }

    async registe(fromClient: UserRegisteInfo, socket: Socket) {
        const user: UserRegister = new UserRegister(fromClient.name, fromClient.credentials);
        transaction(async ()=> {
            const user_id = await user.registe();
            if (user_id && await roomManager.createUserDefaultRoom(user_id)) { //デフォルトのユーザールームも合わせて作成
                socket.emit('user:registered', '登録しました。ログインして下さい。');
            }else{
                socket.emit('user:registered-failure', '登録に失敗しました。');
            }
        });
    }

    async login(credentials: Credentials, socket: Socket) {
        try {
            const { user, success } = await this.loginManager.login(credentials);
            if (success) {

                let toClient: Client = {
                    id: user?.id as string,
                    name: user?.name as string
                };

                socket.request.session.credentials = credentials;
                //イベント発行
                socket.emit('user:logged-in', toClient);
                socket.broadcast.emit('broadcast:user-login',toClient);
    
            }else{
                throw new DomainException('ログイン情報が間違っています。');
            }
        } catch (e) {
            ExceptionHandler.handle(e, socket);
        }
    }

    async logout(id: string,credentials: Credentials, socket: Socket) {
        console.log("logput: ",id);
        if (await this.loginManager.logout(credentials)) {
            socket.broadcast.emit('broadcast:user-logout',id);
            console.log("send logout event-> ",id);
            socket.request.session.credentials = { email: '', password: '' };
            return;
        }
        socket.emit('user:logout-failure',id);
    }

    async authenticate(credentials: Credentials, socket: Socket) {
        if (await this.loginManager.authenticate(credentials)) {
            
        }
    }

    async getUsers(socket: Socket) {
        socket.emit('user:send-users-data', await userService.getUsers());
    }

}
export default new UserController();