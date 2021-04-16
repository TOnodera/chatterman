class LoginObserver {
    static handler: Function;
    static update () {
      if (this.handler) {
        this.handler()
        return
      }
      throw new Error('イベントハンドラがない状態で呼び出されました。')
    }
}
export default LoginObserver
