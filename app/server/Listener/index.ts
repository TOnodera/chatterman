import logger from '../Domain/Utility/logger';
import { Socket } from 'socket.io';
const chatListener = require('./chatListener');
const userListener = require('./userListener');
const applyListener = require('./applyListener');
const serverDisconnectedListener = require('./serverDisconnectedListener');
const roomListener = require('./roomListener');

module.exports = (io: any) => {
    io.once('connection', (socket: Socket) => {
        chatListener(socket);
        userListener(socket);
        applyListener(socket);
        roomListener(socket);
        serverDisconnectedListener(socket);
    });
    logger.debug("リスナ登録");
    setInterval(() => {
        logger.info("接続中のソケット数 -> ", io.of('/').sockets.size);
    }, 3000);

};
