import io, { Socket } from 'socket.io-client'
import swal from '../util/swal'
class ClientSocket {
  socket: typeof Socket;
  constructor() {
    this.socket = io('http://localhost:3000', {
      autoConnect: false,
      // @ts-ignore
      withCredentials: true,
      reconnection: false
    })
    this.onError()
    setInterval(() => {
      console.log('接続状態:', this.socket.connected)
    }, 3000)
  }

  /**
   *
   * @param event
   * @param func
   * リスナが未登録の場合のみ登録する
   */
  registeOnce(event: string, func: Function) {
    if (this.socket.hasListeners(event) == false) {
      this.socket.on(event, func)
    }
  }

  awaitForConnect() {
    return new Promise(resolve => {
      this.socket.on("connect", () => resolve(this.socket.connected));
    })
      .then(result => result);
  }

  async start() {

    if (!this.socket.connected) {
      this.socket.connect()
      const result = await this.awaitForConnect().catch(() => { throw new Error("接続に失敗しました。") })
      return result;
    }

    return true;
  }

  onError() {
    this.registeOnce('desconnect', (reason: string) => {
      swal.error('サーバーから切断されました。')
    })
    this.registeOnce('connect_error', (error: Error) => {
      swal.error('接続エラーが発生しました。')
    })
  }
}
export default new ClientSocket()
