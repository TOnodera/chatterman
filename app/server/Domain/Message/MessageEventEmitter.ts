import { SendMessageToClient } from "server/@types/types";
import { Socket } from "socket.io";

class MessageEventEmitter {

    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    broadcastUserSendMessageEvent(room_id: string, toClient: SendMessageToClient, options: any = {}) {
        this.socket.to(room_id).emit('broadcast:user-send-message', toClient, options);
    }

    sendUserSendMessageEvent(toClient: SendMessageToClient, options: any = {}) {
        this.socket.emit('broadcast:user-send-message', toClient, options);
    }

    broadcastUserTypingEvent(name: string, room_id: string) {
        this.socket.broadcast.emit('broadcast:user-typing', { user_name: name, room_id: room_id });
    }

    sendSendMessagesDataEvent(response: SendMessageToClient[]) {
        this.socket.emit('user:send-messages-data', response);
    }

    sendSendLatestMessagesEvent(response: SendMessageToClient[]) {
        this.socket.emit('user:send-latest-messages', response);
    }

}

export default MessageEventEmitter;
