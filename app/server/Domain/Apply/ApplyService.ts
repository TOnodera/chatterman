import ApplyRepositoryFactory from './Factory/ApplyRepositoryFactory';
import ApplyRepository from './Repository/ApplyRepository';
import polymorphicManager from '../Polymorphic/PolymorphicManager';
import { APPLY_REACTION, ROOM_TYPE } from '../../Enum/Enum';
import uuid = require('node-uuid');
import IRoomEditor from '../Room/Interface/IRoomEditor';
import IRoomRegister from '../Room/Interface/IRoomRegister';
import RoomRegister from '../Room/RoomRegister';
import UserFactory from '../User/Factory/UserFactory';
import IUser from '../User/Interface/IUser';

class ApplyService {
    private repository: ApplyRepository;
    constructor() {
        this.repository = ApplyRepositoryFactory.create();
    }

    makeMessage(name: string) {
        return `
            ${name}さんからダイレクトメッセージの許可申請が届きました。
        `;
    }

    async hasAlreadyRequested(target_id: string, user_id: string): Promise<boolean> {
        return await this.repository.hasAlreadyRequested(target_id, user_id);
    }

    async hasAccepted(target_id: string, user_id: string): Promise<boolean> {
        return await this.repository.hasAccepted(target_id, user_id);
    }

    async hasHandled(target_id: string, user_id: string): Promise<boolean> {
        return await this.repository.hasHandled(target_id, user_id);
    }

    async registeApplication(target_id: string, user_id: string): Promise<number> {
        const polymorphic_id: number = await this.repository.apply(target_id, user_id);
        return polymorphic_id;
    }

    async registeApplyReaction(unique_id: number, reaction: number): Promise<boolean> {
        const polymorphicInfo: PolymorphicInfo = await polymorphicManager.getPolymorphicInfo(unique_id);

        return await this.repository.registeApplyReaction(polymorphicInfo, reaction);
    }

    async isThePerson(unique_id: number, user_id: string): Promise<boolean> {
        const polymorphicInfo: PolymorphicInfo = await polymorphicManager.getPolymorphicInfo(unique_id);
        return await this.repository.isThePerson(polymorphicInfo, user_id);
    }

    messageTxt(name: string, reaction: APPLY_REACTION) {
        return reaction == APPLY_REACTION.IS_ACCEPT_ARROW ? `${name}さんへのDM申請が許可されました。` : `${name}さんへのDM申請が拒否されました。`;
    }

    async registeAccept(unique_id: number, request_user_id: string, target_user_id: string, reaction: APPLY_REACTION) {
        //リアクションを登録
        await this.registeApplyReaction(unique_id, reaction);

        const requestUser: IUser = await UserFactory.create(request_user_id);
        const targetUser: IUser = await UserFactory.create(target_user_id);

        //DMルーム作成
        const name: string = uuid.v4();
        const directMessageRoom: IRoomEditor = await targetUser.room().create(name, ROOM_TYPE.directmessage);
        //申請者と受信者が入場できるように許可を設定する
        await requestUser.room().addAccessableRooms(directMessageRoom.id);
        await targetUser.room().addAccessableRooms(directMessageRoom.id);
    }
}

export default new ApplyService();
