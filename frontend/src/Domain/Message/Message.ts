import socketStore from '../Socket';
import AcceptMessageSubject from './Subject/AcceptMessageSubject';
import TypingEventSubject from './Subject/TypingEventSubject';
import swal from '../../util/swal';
import izitoast from 'izitoast';

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

  deleteAll() {
    this.store.clear();
  }

  send(message: string, me: User, room_id: string, isNoticeRoom: boolean) {
    if (isNoticeRoom) {
      swal.error('このルームにメッセージを送信することは出来ません。');
      return;
    }
    if (this.validate(message, me, room_id) == false) {
      return;
    }
    socketStore.socket.emit('user:send-message', {
      message: message,
      user: me,
      room_id: room_id
    });
  }

  validate(message: string, me: User, room_id: string) {
    if (!me || !room_id) {
      swal.error('不正な送信データです。');
      return false;
    }
    if (!message) {
      izitoast.warning({
        title: 'メッセージを入力して下さい。',
        timeout: 1500,
        position: 'center'
      });
      return false;
    }
  }

  // メッセージ送信要求
  requireMoreMessages(room_id: string) {
    if (this.store.has(room_id)) {
      // moreMessages 日付順にソートして先頭（一番古い）データを取り出す
      const oldest = this.get(room_id).sort((a, b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()).slice(0, 1)[0];
      socketStore.socket.emit('user:more-messages', room_id, oldest.message_id);
    }
  }

  requireFirstMessages(room_id: string) {
    if (this.store.has(room_id) == false) {
      socketStore.socket.emit('user:latest-messages', room_id);
    }
  }

  clearMessages(room_id: string) {
    this.store.delete(room_id);
  }

  acceptMessageHandling(fromServer: any[]) {
    for (const message of fromServer) {
      AcceptMessageSubject.notify(message);
    }
  }

  getChatMessages(room_id: string): any[] {
    return this.get(room_id);
  }

  typing(user: User, room_id: string) {
    socketStore.socket.emit('user:typing', user, room_id);
  }

  typingEventListener() {
    socketStore.registeOnce('broadcast:user-typing', (info: { user_name: string, room_id: string }) => {
      TypingEventSubject.notify(info);
    });
  }

  acceptMessageListener() {
    socketStore.registeOnce('broadcast:user-send-message', (fromServer: any) => {
      console.log("メッセージ受信 1");
      AcceptMessageSubject.notify(fromServer);
    });
    // 送信要求への応答として送られたメッセージの処理
    socketStore.registeOnce('message:send-messages-data', (fromServer: any[]) => {
      console.log("メッセージ受信 2");
      console.log('message:send-messages-data');
      this.acceptMessageHandling(fromServer);
    });
    socketStore.registeOnce('message:send-latest-messages', (fromServer: any[]) => {
      console.log("メッセージ受信 3");
      console.log('message:send-latest-messages');
      this.acceptMessageHandling(fromServer);
    });
  }

  launchListener() {
    this.typingEventListener();
    this.acceptMessageListener();
  }
}

export default new Message();
