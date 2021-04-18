import UserEditor from '../User/User';
import logger from '../Utility/logger';
import PolymorphicRepositoryFactory from './Factory/PolymorphicRepositoryFactory';
import PolymorphicRepository from './Repository/PolymorphicRepository';
import applyPolymorphicManager from './ApplyPolymorphic/ApplyPolymorphicManager';

/**
 * ポリモーフィック関連テーブル(message_polymorphics)の管理クラス
 * それぞれのパッケージ内のリポジトリで好き勝手にmessage_polymorphicsテーブルの処理するとわけわかんなくなるので
 * 多少当周りでもこのクラスを経由させる
 */
class PolymorphicManager {
    private repository: PolymorphicRepository;
    constructor() {
        this.repository = PolymorphicRepositoryFactory.create();
    }

    async getUniqueId(polymorphicInfo: PolymorphicInfo): Promise<number> {
        return await this.repository.getUniqueId(polymorphicInfo);
    }

    async getPolymorphicInfo(unique_id: number): Promise<PolymorphicInfo> {
        return await this.repository.getPolymorphicInfo(unique_id);
    }

    async save(message_id: string, polymorphicInfo: PolymorphicInfo): Promise<boolean> {
        return await this.repository.save(message_id, polymorphicInfo);
    }

    async getMessageOptionsByMessageId(message_id: string): Promise<Options | null> {
        const unique_id: number | null = await this.repository.getUniqueIdByMessageId(message_id);
        if (unique_id) {
            const option: Options = {
                unique_id: unique_id
            };
            return option;
        }
        return null;
    }

    async getMessageApproveOptionByMessageId(message_id: string): Promise<ApproveOptions | null> {
        const result: Options | null = await this.getMessageOptionsByMessageId(message_id);

        if (result) {
            const polymorphicInfo: PolymorphicInfo = await this.getPolymorphicInfo(result.unique_id);
            const user: UserEditor = await applyPolymorphicManager.getRequestUser(polymorphicInfo.polymorphic_id);
            const option: ApproveOptions = {
                unique_id: result.unique_id,
                user_id: user.id
            };
            return option;
        }
        return null;
    }

    /**
     * ./Apply/ApplyPolymorphicManagerのインスタンス取得用
     */
    applyManager() {
        return applyPolymorphicManager;
    }
}
export default new PolymorphicManager();
