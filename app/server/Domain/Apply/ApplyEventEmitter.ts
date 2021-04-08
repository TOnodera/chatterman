import { Socket } from "socket.io";

class ApplyEventEmitter{

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }

    sendAlreadyApplicationIsAcceptedEvent(){
        this.socket.emit('user:already-application-is-accepted', 'DM送信の申請を受信しています。詳しくはお知らせを確認して下さい。');
    }

    sendAlreadyRequestedEvent(){
        this.socket.emit('user:already-requested', '申請を既に送信しています。許可されるのをお待ち下さい。');
    }

    sendNewNotice(information_room_id: string){
        this.socket.to(information_room_id).emit('user:new-notice');
    }

    sendApplyRequestHasSentEvent(){
        this.socket.emit('user:apply-resuest-has-sent', '許可申請を送りました。承認されるまでお待ち下さい。');
    }

}

export default ApplyEventEmitter;
