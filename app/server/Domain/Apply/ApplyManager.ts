import Exception from '../../Exception/Exception';
import logger from '../../Utility/logger';
import SocketExceptionHandler from '../../Exception/SocketExceptionHandler';
import applyService from '../Apply/ApplyService';
import Room from '../Room/Room';
import { transaction } from '../../Utility/Connection/Connection';
import { Socket } from 'socket.io';
import ApplyEventEmitter from './ApplyEventEmitter';
import { APPLY_REACTION, PolymorphicTables } from '../../Enum/Enum';
import SocketService from '../../Utility/SocketService';
import User from '../User/User';
import polymorphicManager from '../Polymorphic/PolymorphicManager';
import userService from '../User/Service';
import SystemMessage from '../Message/SystemMessage';
import Config from '../../Config';
import MessageRegister from '../Message/MessageRegister';
import UserFactory from '../User/Factory/UserFactory';
import IRoom from '../Room/Interface/IRoom';
import IUser from '../User/Interface/IUser';

/**
 * TODO ソケット使ってる部分別クラスにする形でリファクタリングしたい
 */

class ApplyManager {
    private socket: Socket;
    private applyEventEmitter: ApplyEventEmitter;
    private systemMessage: SystemMessage;

    constructor(socket: Socket) {
        this.socket = socket;
        this.applyEventEmitter = new ApplyEventEmitter(socket);
        this.systemMessage = new SystemMessage(socket);
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

            //申請対象のユーザーを取得
            const targetUser: IUser = await UserFactory.create(target_id);

            const [information_room]: any[] = await transaction(async () => {
                const polymorphic_id: number = await applyService.registeApplication(targetUser.id, info.user.id);
                const information_room = await targetUser.room().getInformationRoomId();
                //送信テキスト生成
                const messageTxt = applyService.makeMessage(info.user.name);

                //システムから対象者にメッセージ送信
                const messageOption: MessageOptions = {
                    polymorphic_table: PolymorphicTables.requests,
                    polymorphic_id: polymorphic_id
                };
                const systemUser: User = await UserFactory.create(Config.system.superuser);
                const messageRegister = new MessageRegister(messageTxt, systemUser, information_room);
                await this.systemMessage.send(messageRegister, messageOption);

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
        const targetUser: User = await polymorphicManager.applyManager().getTargetUser(polymorphicInfo.polymorphic_id);
        const requestUser: User = await userService.getUserById(requestUserId);


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
                const [roomInfo]: RoomInfo[] = await requestUser.room().getInformationRoom(requestUser.id);
                const message: string = applyService.messageTxt(targetUser.name, reaction);
                const systemUser: User = await UserFactory.create(Config.system.superuser);
                const messageRegister = new MessageRegister(message, systemUser, roomInfo.room_id);
                this.systemMessage.send(messageRegister);

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
