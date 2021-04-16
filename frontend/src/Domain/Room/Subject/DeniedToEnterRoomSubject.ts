import DeniedToEnterRoomObserver from '../Observer/DeniedToEnterRoomObserver'

class DeniedToEnterRoomSubject {
  notify (denied: string) {
    DeniedToEnterRoomObserver.update(denied)
  }
}

export default new DeniedToEnterRoomSubject()
