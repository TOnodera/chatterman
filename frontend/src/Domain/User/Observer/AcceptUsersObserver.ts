class AcceptUsersObserver {
    static handler : Function;
    static update (users: any[]) {
      if (this.handler) {
        this.handler(users)
        return
      }
      throw new Error('イベントハンドラが設定されていない状態で呼び出されました。')
    }
}
export default AcceptUsersObserver
