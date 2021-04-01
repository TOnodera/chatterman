import socketStore from '../Socket';
import AcceptMessageSubject from './AcceptMessageSubject';
import TypingEventSubject from './TypingEventSubject';

class Message{

    private store: Map<string,any[]>;

    constructor(){
        this.store = new Map<string,string[]>();
        this.acceptMessageListener();
        this.typingEventListener();
    }

    set(key: string,value: string[]){
        this.store.set(key,value);
    }

    delete(key: string): boolean{
        return this.store.delete(key);
    }

    get(key: string): string[]{
        return this.store.has(key) ? this.store.get(key) as string[] : [];
    }

    send(message: string,me: User,room_id: string = 'everybody'){
        socketStore.socket.emit('user:send-message',{
            message: message,
            user: me,
            room_id: room_id
        });
    }

    acceptMessageListener(){
        socketStore.socket.on('broadcast:user-send-message',(fromServer: any)=>{
           AcceptMessageSubject.notify(fromServer);
        });
    }

    getChatMessages(room_id: string): any[]{
        return this.get(room_id);
    }

    typing(user: User){
        socketStore.socket.emit('user:typing',user);
    }

    typingEventListener(){
        socketStore.socket.on('broadcast:user-typing',(user: User)=>{
            TypingEventSubject.notify(user);
        });
    }
}

export default new Message();