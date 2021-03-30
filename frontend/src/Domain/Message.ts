import socketStore from './Socket';
class Message{
    send(message: string,me: User,room_id: string = 'everybody'){
        socketStore.socket.emit('user:send-message',{
            message: message,
            user: me,
            room_id: room_id
        });
    }
    
}

export default new Message();