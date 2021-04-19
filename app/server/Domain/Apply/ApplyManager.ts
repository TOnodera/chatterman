import { loginManager } from '../User/Login/LoginManager';
import Exception from '../../Exception/Exception';
import logger from '../../Utility/logger';
import SocketExceptionHandler from '../../Exception/SocketExceptionHandler';
import applyService from '../Apply/ApplyService';
import roomManager from '../Room/RoomManager';
import { transaction } from '../../Utility/Connection/Connection';
import { Socket } from 'socket.io';
import NotifyManager from '../Notify/NotifyManager';
import ApplyEventEmitter from './ApplyEventEmitter';
import { APPLY_REACTION, PolymorphicTables, ROOM_TYPE } from '../../Enum/Enum';
import SocketService from '../../Utility/SocketService';
import UserEditor from '../User/UserEditor';
import polymorphicManager from '../Polymorphic/PolymorphicManager';
import userService from '../User/Service';

/**
 * TODO ソケット使ってる部分別クラスにする形でリファクタリングしたい
 */

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

                //システムから対象者にメッセージ送信
                const messageOption: MessageOptions = {
                    polymorphic_table: PolymorphicTables.requests,
                    polymorphic_id: polymorphic_id
                };
                await this.notifyManager.sendNoticeMessage(messageTxt, information_room, messageOption);

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
     * @param requestUserId
     * @param reaction
     * 申請に対するリアクションを処理
     */
    async reaction(unique_id: number, requestUserId: string, reaction: APPLY_REACTION) {
        if ((await applyService.isThePerson(unique_id, requestUserId)) == false) {
            throw new Exception('unique_idに紐づくrequestUserIdが送られてきたrequestUserIdと一致しません。不正アクセスの可能性があります。');
        }

        const polymorphicInfo: PolymorphicInfo = await polymorphicManager.getPolymorphicInfo(unique_id);
        const targetUser: UserEditor = await polymorphicManager.applyManager().getTargetUser(polymorphicInfo.polymorphic_id);
        const requestUser: UserEditor = await userService.getUserById(requestUserId);


        //処理済みか確認
        if (await applyService.hasHandled(targetUser.id, requestUser.id)) {
            logger.debug('処理済み');
            this.applyEventEmitter.sendAlreadyApplicationHasHandledEvent();
            return;
        }

        switch (reaction) {
            case APPLY_REACTION.IS_ACCEPT_ARROW: //許可
                //登録
                await applyService.registeAccept(unique_id, requestUser.id, targetUser.id, reaction);

                //申請者にメッセージ送信
                const [roomInfo]: RoomInfo[] = await roomManager.getInformationRoom(requestUser.id);
                const message: string = applyService.messageTxt(targetUser.name, reaction);
                this.notifyManager.sendNoticeMessage(message, roomInfo.room_id);

                //DMルーム情報の更新をするために更新要求を送る(申請者と受信者双方)
                this.applyEventEmitter.sendRoomDataUpdateEventToTargetUser();
                //申請者側にも送る
                const requestUserSockets: string[] = SocketService.getSocketsFromUserId(requestUser.id);
                for (const socket_id of requestUserSockets) {
                    //接続している全ての端末に更新要求を送る
                    this.applyEventEmitter.sendRoomUpdateEventToRequestUser(socket_id);
                }

                break;

            case APPLY_REACTION.IS_ACCEPT_DENY: //拒否
                //リアクションを登録
                await applyService.registeApplyReaction(unique_id, reaction);

                break;
            default:
                throw new Exception('到達不能なコード');
        }
    }
}

export default ApplyManager;
