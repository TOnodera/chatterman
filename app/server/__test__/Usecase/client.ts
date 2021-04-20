import io from 'socket.io-client';

const clientPort = 3001;

const clientSocket = io(`http://localhost:${clientPort}`, {
    autoConnect: false,
    // @ts-ignore
    withCredentials: true,
    reconnection: false
});

export {
    clientPort,
    clientSocket
};