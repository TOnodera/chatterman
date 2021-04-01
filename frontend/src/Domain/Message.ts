import socketStore from './Socket';
class Message{

    private store: Map<string,string[]>;
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

    send(message: string,me: User,room_id: string = 'everybody'){
        socketStore.socket.emit('user:send-message',{
            message: message,
            user: me,
            room_id: room_id
        });
    }

    acceptMessageListener(){
        socketStore.socket.on('broadcast:user-send-message',(fromServer: any)=>{
            const messages: any[] = this.store.has(fromServer.room_id) ? this.store.get(fromServer.room_id) as string[] : [];
            messages.push(fromServer);
            this.store.set(fromServer.room_id,messages);
            this.acceptMessageNotify(fromServer.room_id);
            console.log('in acceptMessageLstener: this.store ->',this.store);
        });
    }

    addAcceptMessageHandler(func: Function){
        this.acceptMessageHandler = func;
    }

    acceptMessageNotify(room_id: string){
        this.acceptMessageHandler(this.store.get(room_id));
    }

    //TODO リスナーとハンドラいっぱいになってきたのでクラス設計見直す
    //別のルームに移動した際に移動先ルームのメッセージを取得する
    changeRoomListener(room_id: string){
        const messages = this.store.has(room_id) ? this.store.get(room_id) : [] as any[];
        this.changeRoomHandler(messages);
        console.log("in chageRoomListener: this.store -> ",this.store);
    }

    addChangeRoomHandler(func: Function){
        this.changeRoomHandler = func;
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