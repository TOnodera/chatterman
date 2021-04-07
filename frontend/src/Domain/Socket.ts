import io, { Socket } from 'socket.io-client';
import swal from '../util/swal';
class ClientSocket {

    socket: typeof Socket;
    constructor () {
      this.socket = io('http://localhost:3000');
      this.onError();
    }

    /**
     * 
     * @param event 
     * @param func 
     * リスナが未登録の場合のみ登録する
     */
    registeOnce(event: string,func: Function){
      if(this.socket.hasListeners(event) == false){
        this.socket.on(event,func);
      }
    }

    onError () {
      this.registeOnce('desconnect', (reason: string) => {
          swal.error('サーバーから切断されました。');
      });
      this.registeOnce('connect_error',(error: Error)=>{
          swal.error('接続エラーが発生しました。');
      });
    }
}
export default new ClientSocket();
