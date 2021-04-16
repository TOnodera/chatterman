class ArrowedToEnterRoomObserver {
    static handler: Function;
    static update (room_id: string) {
      if (this.handler) {
        this.handler(room_id);
        return;
      }
      throw new Error('イベントハンドラがない状態で呼び出されました。');
    }
}
export default ArrowedToEnterRoomObserver;
