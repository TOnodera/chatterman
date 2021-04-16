import ArrowedToEnterRoomObserver from '../Observer/ArrowedToEnterRoomObserver'

class ArrowedToEnterRoomSubject {
  notify (room_id: string) {
    ArrowedToEnterRoomObserver.update(room_id)
  }
}

export default new ArrowedToEnterRoomSubject()
