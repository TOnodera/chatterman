import logger from '../Domain/Utility/logger';
import { Socket } from 'socket.io';
const chatListener = require('./chatListener');
const userListener = require('./userListener');
const applyListener = require('./applyListener');
const serverDisconnectedListener = require('./serverDisconnectedListener');
const roomListener = require('./roomListener');

module.exports = (io: any) => {

    io.on('connection', (socket: Socket) => {
        chatListener(socket);
        userListener(socket);
        applyListener(socket);
        roomListener(socket);
        serverDisconnectedListener(socket);

        setInterval(() => {
            logger.info("connectionイベントリスナ数 -> ", socket.listenerCount("user:after-login"));
        }, 3000);

    });
    logger.debug("リスナ登録");


};
