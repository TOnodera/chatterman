class TypingEventObserver {
    static handle: Function;
    static update (info: {user_name:string, room_id: string}) {
      if (this.handle) {
        this.handle(info);
        return;
      }
      throw new Error('イベントハンドラが設定されていない状態で呼び出されました。');
    }
}
export default TypingEventObserver;
