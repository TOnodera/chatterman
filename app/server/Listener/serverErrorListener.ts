import logger from "../Domain/Utility/logger";
import { Socket } from "socket.io";
import { loginManager } from '../Domain/User/LoginManager';

module.exports = (socket: Socket) => {
    //切断中まだ切断されていない
    socket.on('disconnecting',()=>{
        logger.info('disconnectiong...:',socket.id);
        loginManager.getAfterLoginManager(socket).disconnectedLogout(socket);
    });
    //切断
    socket.on('disconnect',(reason: string)=>{
        logger.info('disconnected:',reason,socket.id);
    });
};