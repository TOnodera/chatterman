import loginManager from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import applyService from '../Apply/ApplyService';
import roomManager from '../Room/RoomManager';
import { transaction } from '../Utility/Connection';
import { Socket } from "socket.io";
import NotifyManager from "../Notify/NotifyManager";
import ApplyEventEmitter from "./ApplyEventEmitter";

class ApplyManager{

    private socket: Socket;
    private notifyManager: NotifyManager;
    private applyEventEmitter: ApplyEventEmitter;

    constructor(socket: Socket) {
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

            //自分宛てのDM許可申請が無いか確認
            if (await applyService.hasAccepted(target_id, info.user.id)) {
                this.applyEventEmitter.sendAlreadyApplicationIsAcceptedEvent();
                return;
            }

            //送信済みの許可申請が無いか確認
            if (await applyService.hasAlreadyRequested(target_id, info.user.id)) {
                this.applyEventEmitter.sendAlreadyRequestedEvent();
                return;
            }

            const [information_room]: any[] = await transaction(async ()=>{

                const options: MessageOptions = await applyService.registeApplication(target_id,info.user.id);
                const information_room = await roomManager.getInformationRoomId(target_id);
                //送信テキスト生成
                const messageTxt = applyService.makeMessage(info.user.name, options.polymorphic_id, info.user.id);
                //相手のお知らせルームにメッセージを送信
                await this.notifyManager.sendNoticeMessage(messageTxt, information_room, options);

                return [information_room];
            });

            //相手に新規お知らせの通知イベント発行
            this.applyEventEmitter.sendNewNotice(information_room);

        } catch (e) {
            SocketExceptionHandler.handle(e, this.socket);
        }

        this.applyEventEmitter.sendApplyRequestHasSentEvent();
        logger.info(`2/2 ApplyController.apply() -> 処理完了 request_user: ${info.credentials.email}`);

    }

    /**
     * 
     * @param unique_id 
     * @param user_id 
     * @param reaction 
     * 申請に対するリアクションを処理
     */
    async reaction(unique_id: string,user_id: string,reaction: number){
        if(await applyService.isThePerson(unique_id,user_id) == false){
            throw new Exception('unique_idに紐づくuser_idが送られてきたuser_idと一致しません。不正アクセスの可能性があります。');
        }
        switch(reaction){
            case APPLY_REACTION.IS_ACCEPT_ARROW:
            case APPLY_REACTION.IS_ACCEPT_DENY:
                await applyService.registeApplyReaction(unique_id,reaction);
                break;
            default:
                throw new Exception("到達不能なコード");
        }
    }
}

export default ApplyManager;