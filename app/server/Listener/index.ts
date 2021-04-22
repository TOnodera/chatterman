import { Socket } from 'socket.io';
const chatListener = require('./chatListener');
const userListener = require('./userListener');
const applyListener = require('./applyListener');
const serverDisconnectedListener = require('./serverDisconnectedListener');
const roomListener = require('./roomListener');


/**
 * クライアントから送られてくる各種イベントのリスナ
 */
module.exports = (io: any) => {

    io.on('connection', (socket: Socket) => {
        chatListener(socket);
        userListener(socket);
        applyListener(socket);
        roomListener(socket);
        serverDisconnectedListener(socket);
    });

};