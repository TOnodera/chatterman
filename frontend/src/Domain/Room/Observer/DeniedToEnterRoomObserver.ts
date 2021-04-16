class DeniedToEnterRoomObserver {
    static handler: Function;
    static update (denied: string) {
      if (this.handler) {
        this.handler(denied)
        return
      }
      throw new Error('イベントハンドラがない状態で呼び出されました。')
    }
}
export default DeniedToEnterRoomObserver
