import NoticeObserver from '../Observer/NoticeObserver';

class NoticeSubject {
  notify () {
    NoticeObserver.update();
  }
}

export default new NoticeSubject();
