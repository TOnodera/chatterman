class NoticeObserver {
    static handler: Function;
    static update () {
      if (this.handler) {
        this.handler()
        return
      }
      throw new Error('イベントハンドラが登録されていない状態で呼び出されました。')
    }
}
export default NoticeObserver
