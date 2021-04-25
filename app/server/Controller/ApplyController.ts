import { APPLY_REACTION } from '../Enum/Enum';
import { Socket } from 'socket.io';
import IUser from '../Domain/User/Interface/IUser';
import UserService from '../Domain/User/Service';
import SocketExceptionHandler from '../Exception/SocketExceptionHandler';

class ApplyController {
    /**
     * 申請処理はイベントが多いのでイベント送信もマネージャーに任せることにした
     */
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    async apply(target_id: string) {
        try {
            const user: IUser = await UserService.getUserByCredentials(this.socket.request.session.credentials);
            const targetUser: IUser = await UserService.getUserById(target_id);
            await user.apply(this.socket).apply(targetUser);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
    }

    async reaction(unique_id: number, user_id: string, reaction: APPLY_REACTION) {
        try {
            const user: IUser = await UserService.getUserByCredentials(this.socket.request.session.credentials);
            await user.apply(this.socket).reaction(unique_id, user_id, reaction);
        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }
    }
}

export default ApplyController;
