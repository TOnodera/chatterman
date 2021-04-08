import loginManager from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import { UserBasicInfo } from "server/@types/types";
import apply from '../Apply/Apply';
import { Socket } from "socket.io";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import applyService from '../Apply/ApplyService';
import NotifyManager from "../Notify/NotifyManager";
import ApplyEventEmitter from "../Apply/ApplyEventEmitter";


class ApplyController {

    private socket: Socket;
    private notifyManager: NotifyManager;
    private applyEventEmitter: ApplyEventEmitter;

    constructor(socket: Socket){
        this.socket = socket;
        this.notifyManager = new NotifyManager(socket);
        this.applyEventEmitter = new ApplyEventEmitter(socket);
    }

    async apply(target_id: string, info: UserBasicInfo) {

        logger.info(`1/2 ApplyController.apply() -> 処理開始 target_id: ${target_id}, request_user: ${info.credentials.email}`);

        if (await loginManager.authenticate(info.credentials) == false) {
            throw new Exception("認証情報がない状態でDM申請を行ないました。不正な操作です。");
        }

        try {

            if (await apply.hasAccepted(target_id, info.user.id)) {
                this.applyEventEmitter.sendAlreadyApplicationIsAcceptedEvent();
                return;
            }

            if (await apply.hasAlreadyRequested(target_id, info.user.id)) {
                this.applyEventEmitter.sendAlreadyRequestedEvent();
                return;
            }

            const apply_id:string = await apply.apply(target_id, info.user.id);
            const information_room = await apply.getUserinformationRoomId(target_id);
            //相手にお知らせメッセージを送信
            await this.notifyManager.sendNoticeMessage(applyService.makeMessage(info.user.name,apply_id,info.user.id), information_room);
            //相手に新規お知らせメッセージの通知イベント送信
            this.applyEventEmitter.sendNewNotice(information_room);

        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }

        this.applyEventEmitter.sendApplyRequestHasSentEvent();
        logger.info(`2/2 ApplyController.apply() -> 処理完了 request_user: ${info.credentials.email}`);

    }
}

export default ApplyController;