import io, { Socket } from 'socket.io-client';
import swal from '../util/swal';
class ClientSocket {
    socket: typeof Socket;
    constructor () {
      this.socket = io('http://localhost:3000');
      this.onError();
    }

    onError () {
      this.socket.on('desconnect', (reason: string) => {
          swal.fire('サーバーから切断されました。');
      });
      this.socket.on('connect_error',(error: Error)=>{
          swal.fire('接続エラーが発生しました。');
      });
    }
}
export default new ClientSocket();
