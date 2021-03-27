import {io,Socket} from 'socket.io-client';
export default {
    socket: io('http://localhost:3000') as Socket
}