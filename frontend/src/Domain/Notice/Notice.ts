import socketStore from '../Socket'
import noticeSubject from './Subject/NoticeSubject'

class Notice {
  launchListener () {
    this.noticeListener()
  }

  noticeListener () {
    socketStore.registeOnce('user:new-notice', () => {
      noticeSubject.notify()
    })
  }
}

export default new Notice()
