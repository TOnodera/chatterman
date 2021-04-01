import socketStore from '../Socket';
import AcceptMessageObserver from './AcceptMessageObserver';
import AcceptMessageSubject from './AcceptMessageSubject';
import acceptMessageSubject from './AcceptMessageSubject';
class Message{

    private store: Map<string,any[]>;
    private acceptMessageHandler: Function;
    private typingEventHandler: Function;
    private changeRoomHandler: Function;

    constructor(){
        this.store = new Map<string,string[]>();
        this.acceptMessageHandler = Function;
        this.typingEventHandler = Function;
        this.changeRoomHandler = Function;
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
            /*
            const messages: any[] = this.store.has(fromServer.room_id) ? this.store.get(fromServer.room_id) as string[] : [];
            messages.push(fromServer);
            this.store.set(fromServer.room_id,messages);
            this.acceptMessageNotify(fromServer.room_id);
            console.log('in acceptMessageLstener: this.store ->',this.store);
            */
           AcceptMessageSubject.notify(fromServer);
        });
    }

    addAcceptMessageHandler(func: Function){
        this.acceptMessageHandler = func;
    }

    acceptMessageNotify(room_id: string){
        this.acceptMessageHandler(this.store.get(room_id));
    }

    getChatMessages(room_id: string): any[]{
        return this.get(room_id);
    }

    typing(user: User){
        socketStore.socket.emit('user:typing',user);
    }

    addTypingEventHandler(func: Function){
        this.typingEventHandler = func;
    }

    typingEventListener(){
        socketStore.socket.on('broadcast:user-typing',(user: User)=>{
            this.typingEventNotify(user);
        });
    }

    typingEventNotify(user: User){
        this.typingEventHandler(user);
    }

}

export default new Message();