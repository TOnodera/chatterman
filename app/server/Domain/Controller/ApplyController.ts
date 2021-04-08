import loginManager from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import { UserBasicInfo } from "server/@types/types";
import apply from '../Apply/Apply';
import { Socket } from "socket.io";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import notifyManager from '../Notify/NotifyManager';
import applyService from '../Apply/ApplyService';


class ApplyController {

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }

    async apply(target_id: string, info: UserBasicInfo) {

        logger.info(`1/2 ApplyController.apply() -> 処理開始 target_id: ${target_id}, request_user: ${info.credentials.email}`);

        if (await loginManager.authenticate(info.credentials) == false) {
            throw new Exception("認証情報がない状態でDM申請を行ないました。不正な操作です。");
        }

        try {

            if (await apply.hasAccepted(target_id, info.user.id)) {
                this.socket.emit('user:already-application-is-accepted', 'DM送信の申請を受信しています。詳しくはお知らせを確認して下さい。');
                return;
            }

            if (await apply.hasAlreadyRequested(target_id, info.user.id)) {
                this.socket.emit('user:already-requested', '申請を既に送信しています。許可されるのをお待ち下さい。');
                return;
            }

            const apply_id:string = await apply.apply(target_id, info.user.id);
            const information_room = await apply.getUserinformationRoomId(target_id);
            //お知らせメッセージを送信
            await notifyManager.sendNoticeMessage(applyService.makeMessage(info.user.name,apply_id,info.user.id), information_room,this.socket);
            //新規お知らせメッセージの通知
            this.socket.to(information_room).emit('user:new-notice');

        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }

        this.socket.emit('user:apply-resuest-has-sent', '許可申請を送りました。承認されるまでお待ち下さい。');
        logger.info(`2/2 ApplyController.apply() -> 処理完了 request_user: ${info.credentials.email}`);

    }
}

export default ApplyController;