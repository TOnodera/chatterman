import messages from '../Message/Messages';
import { Socket } from "socket.io";
import { SendMessageToClient } from "server/@types/types";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import logger from "../Utility/logger";
import MessageService from '../Message/MessaseService';
import MessageEventEmitter from '../Message/MessageEventEmitter';
import MessageManager from '../Message/MessageManager';
import Exception from '../Exception/Exception';

class MessageController {

    private socket: Socket;
    private messageManager: MessageManager;

    constructor(socket: Socket){
        this.socket = socket;
        this.messageManager = new MessageManager(socket);
    }

    async add(message: string, user_id: string, room_id: string) {
        this.messageManager.add(message,user_id,room_id).catch(e=>{SocketExceptionHandler.handle(e,this.socket)});
    }

    delete(): void {

    }

    edit(): void {

    }

    typing(user: { id: string, name: string }, room_id: string): void {
        this.messageManager.typing(user,room_id);
    }

    async moreMessages(room_id: string, message_id: string) {
        this.messageManager.moreMessages(room_id,message_id).catch(e=>{SocketExceptionHandler.handle(e,this.socket)});
    }

    async getLatest(room_id: string) {
        this.messageManager.getLatest(room_id).catch(e=>{SocketExceptionHandler.handle(e,this.socket)});
    }

}

export default MessageController;