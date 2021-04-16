import LoginObserver from '../Observer/LoginObserver'
class LoginSubject {
  notify () {
    if (LoginObserver.handler) {
      LoginObserver.handler()
      return
    }
    throw new Error('イベントハンドラが設定されていない状態で呼び出せました。')
  }
}
export default new LoginSubject()
