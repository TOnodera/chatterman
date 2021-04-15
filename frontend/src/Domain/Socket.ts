import io, { Socket } from 'socket.io-client';
import swal from '../util/swal';
class ClientSocket {

  socket: typeof Socket;
  constructor() {
    this.socket = io('http://localhost:3000', {
      autoConnect: false,
      //@ts-ignore
      withCredentials: true
    });
    this.onError();
    setInterval(() => {
      console.log("接続状態:", this.socket.connected);
    }, 3000);
  }

  /**
   * 
   * @param event 
   * @param func 
   * リスナが未登録の場合のみ登録する
   */
  registeOnce(event: string, func: Function) {
    if (this.socket.hasListeners(event) == false) {
      this.socket.on(event, func);
    }
  }

  async start() {
    console.log("start connect()");
    this.socket.connect();
    const result = await new Promise((resolve, reject) => {
      this.socket.on("connect", () => {
        resolve(this.socket.connected);
        console.log("done connect()");
      });
    })
      .then(result => result);
    console.log("end connect()");

    return result;
  }

  onError() {
    this.registeOnce('desconnect', (reason: string) => {
      swal.error('サーバーから切断されました。');
    });
    this.registeOnce('connect_error', (error: Error) => {
      swal.error('接続エラーが発生しました。');
    });
  }
}
export default new ClientSocket();
