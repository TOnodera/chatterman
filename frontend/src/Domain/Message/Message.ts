import socketStore from '../Socket';
import AcceptMessageSubject from './Subject/AcceptMessageSubject';
import TypingEventSubject from './Subject/TypingEventSubject';

class Message {

    private store: Map<string, any[]>;

    constructor() {
        this.store = new Map<string, any[]>();
    }

    set(key: string, value: any[]) {
        this.store.set(key, value);
    }

    delete(key: string): boolean {
        return this.store.delete(key);
    }

    get(key: string): any[] {
        return this.store.has(key) ? this.store.get(key) as any[] : [];
    }

    send(message: string, me: User, room_id: string) {
        socketStore.socket.emit('user:send-message', {
            message: message,
            user: me,
            room_id: room_id
        });
    }

    //メッセージ送信要求
    requireMoreMessages(room_id: string) {
        if (this.store.has(room_id)) {
            //moreMessages 日付順にソートして先頭（一番古い）データを取り出す
            const oldest = this.get(room_id).sort((a, b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()).slice(0, 1)[0];
            socketStore.socket.emit('user:more-messages', room_id, oldest.message_id);
        }
    }

    requireFirstMessages(room_id: string) {
        if (this.store.has(room_id) == false) {
            socketStore.socket.emit('user:latest-messages', room_id);
        }
    }

    clearMessages(room_id: string){
        this.store.delete(room_id);
    }

    acceptMessageHandling(fromServer: any[]) {
        for (let message of fromServer) {
            AcceptMessageSubject.notify(message);
        }
    }

    getChatMessages(room_id: string): any[] {
        return this.get(room_id);
    }

    typing(user: User,room_id: string) {
        socketStore.socket.emit('user:typing', user,room_id);
    }

    typingEventListener() {
        socketStore.socket.on('broadcast:user-typing', (user: User,room_id: string) => {
            TypingEventSubject.notify(user,room_id);
        });
    }

    acceptMessageListener() {
        socketStore.socket.on('broadcast:user-send-message', (fromServer: any) => {
            AcceptMessageSubject.notify(fromServer);
        });
        //送信要求への応答として送られたメッセージの処理
        socketStore.socket.on('user:send-messages-data', (fromServer: any[]) => {
            this.acceptMessageHandling(fromServer);
        });
        socketStore.socket.on('user:send-latest-messages', (fromServer: any[]) => {
            this.acceptMessageHandling(fromServer);
        });
    }

    launchListener(){
        this.typingEventListener();
        this.acceptMessageListener();
    }

}

export default new Message();