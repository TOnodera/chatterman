import { Socket } from 'socket.io';
const chatListener = require('./chatListener');
const userListener = require('./userListener');
const serverErrorListener = require("./ServerErrorListener");

module.exports = (io:any) => {
    io.on('connection',(socket: Socket)=>{
        chatListener(socket);
        userListener(socket);
        serverErrorListener(socket);
    });
}