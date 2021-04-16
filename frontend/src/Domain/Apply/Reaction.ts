import { APPLY_REACTIONS } from '@/Enum'
import socketStore from '../Socket'
class Reaction {
  send (unique_id: number, user_id: string, reaction: APPLY_REACTIONS) {
    socketStore.socket.emit('user:apply-reaction', unique_id, user_id, reaction)
  }
}

export default new Reaction()
