import io, { Socket } from 'socket.io-client';
import swal from '../util/swal';
class ClientSocket {

    socket: typeof Socket;
    private eventArray: string[];
    constructor () {
      this.socket = io('http://localhost:3000');
      this.onError();
      this.eventArray = [];
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
        this.eventArray.push(event);
      }
    }

    onError () {
      this.socket.on('desconnect', (reason: string) => {
          swal.error('サーバーから切断されました。');
      });
      this.socket.on('connect_error',(error: Error)=>{
          swal.error('接続エラーが発生しました。');
      });
    }
}
export default new ClientSocket();
