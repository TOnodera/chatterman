import { loginManager } from "../User/LoginManager";
import Exception from "../Exception/Exception";
import logger from "../Utility/logger";
import SocketExceptionHandler from "../Exception/SocketExceptionHandler";
import applyService from '../Apply/ApplyService';
import roomManager from '../Room/RoomManager';
import { transaction } from '../Utility/Connection/Connection';
import { Socket } from "socket.io";
import NotifyManager from "../Notify/NotifyManager";
import ApplyEventEmitter from "./ApplyEventEmitter";
import userManager from "../User/UserManager";
import { APPLY_REACTION, PolymorphicTables, ROOM_TYPE } from "../../Enum/Enum";
import User from "../User/User";
import polymorphicManager from '../Polymorphic/PolymorphicManager';
import uuid from "node-uuid";
import Room from "../Room/Room";
import SocketService from "../Utility/SocketService";

class ApplyManager {

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
        if (await loginManager.getAfterLoginManager(this.socket).authenticate(info.credentials) == false) {
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


            const [information_room]: any[] = await transaction(async () => {

                const polymorphic_id: number = await applyService.registeApplication(target_id, info.user.id);
                const information_room = await roomManager.getInformationRoomId(target_id);
                //送信テキスト生成
                const messageTxt = applyService.makeMessage(info.user.name);

                const messageOption: MessageOptions = { polymorphic_table: PolymorphicTables.requests, polymorphic_id: polymorphic_id };
                await this.notifyManager.sendNoticeMessage(messageTxt, information_room, messageOption);;

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
     * @param request_user_id 
     * @param reaction 
     * 申請に対するリアクションを処理
     */
    async reaction(unique_id: number, request_user_id: string, reaction: number) {

        if (await applyService.isThePerson(unique_id, request_user_id) == false) {
            throw new Exception('unique_idに紐づくrequest_user_idが送られてきたrequest_user_idと一致しません。不正アクセスの可能性があります。');
        }

        switch (reaction) {
            case APPLY_REACTION.IS_ACCEPT_ARROW:
            case APPLY_REACTION.IS_ACCEPT_DENY:

                //リアクションを登録
                await applyService.registeApplyReaction(unique_id, reaction);

                //申請者とのDMに使うルームを受信者側で新規作成
                const polymorphicInfo: PolymorphicInfo = await polymorphicManager.getPolymorphicInfo(unique_id);
                const target_user: User = await polymorphicManager.applyManager().getTargetUser(polymorphicInfo.polymorphic_id);
                const directMessageRoom: Room = await roomManager.createRoom(uuid.v4(), target_user.id, ROOM_TYPE.directmessage);

                //申請者と受信者が入場できるように許可を設定する
                logger.debug(request_user_id, target_user.id);
                await roomManager.addAccessableRooms(request_user_id, directMessageRoom.id);
                await roomManager.addAccessableRooms(target_user.id, directMessageRoom.id);

                //申請者にメッセージ送信
                const [roomInfo]: RoomInfo[] = await roomManager.getInformationRoom(request_user_id);
                const message: string = applyService.messageTxt(target_user.name, reaction);
                this.notifyManager.sendNoticeMessage(message, roomInfo.room_id);

                //DMルーム情報の更新をするために更新要求を送る
                const targetUserSockets: string[] = SocketService.getSocketsFromUserId(target_user.id);
                for(const socket_id of targetUserSockets){
                    logger.debug(`更新要求送信： socket.id=${socket_id},user=${target_user.name}`);
                    this.socket.to(socket_id).emit('room:data-update');
                }

                const requestUserSockets: string[] = SocketService.getSocketsFromUserId(request_user_id);
                for(const socket_id of requestUserSockets){
                    logger.debug(`更新要求送信： socket.id=${socket_id},user=${request_user_id}`);
                    this.socket.to(socket_id).emit('room:data-update');
                }


                break;
            default:
                throw new Exception("到達不能なコード");
        }

    }
}

export default ApplyManager;