import { Socket } from 'socket.io';

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
        socket.emit('broadcast:user-logout', user_id);
        console.log('broadcast:user-logoutイベント発行');
    }
}

export default new UserEventEmitter();
