import { Socket } from "socket.io";

class UserEventEmitter {

    sendLoggedInEvent(toClient: Client, socket: Socket) {
        socket.emit('user:logged-in', toClient);
    }

    broadcastUserLoginEvent(toClient: Client, socket: Socket) {
        socket.broadcast.emit('broadcast:user-login', toClient);
    }

    sendLogoutFailureEvent(id: string, socket: Socket) {
        socket.emit('user:logout-failure', id);
    }

    broadcastUserLogout(user_id: string, socket: Socket) {
        socket.broadcast.emit('broadcast:user-logout', user_id);
    }

}

export default new UserEventEmitter;
