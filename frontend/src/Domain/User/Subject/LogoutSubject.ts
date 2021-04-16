import LogoutObserver from '../Observer/LogoutObserver'
class LogoutSubject {
  notify (id: string) {
    LogoutObserver.update(id)
  }
}
export default new LogoutSubject()
