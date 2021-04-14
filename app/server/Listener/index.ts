import { Socket } from 'socket.io';
const chatListener = require('./chatListener');
const userListener = require('./userListener');
const applyListener = require('./applyListener');
const serverErrorListener = require("./serverErrorListener");
const roomListener = require('./roomListener');

module.exports = (io:any) => {
    io.on('connection',(socket: Socket)=>{
        chatListener(socket);
        userListener(socket);
        applyListener(socket);
        roomListener(socket);
        serverErrorListener(socket);
    });
}