import Exception from "../Exception/Exception";
import PolymorphicRepositoryFactory from "./Factory/PolymorphicRepositoryFactory";
import PolymorphicRepository from "./Repository/PolymorphicRepository";

/**
 * ポリモーフィック関連テーブル(message_polymorphics)の管理クラス
 * それぞれのパッケージ内のリポジトリで好き勝手にmessage_polymorphicsテーブルの処理するとわけわかんなくなるので
 * 多少当周りでもこのクラスを経由させる
 */
class PolymorphicManager{

    private repository: PolymorphicRepository;
    constructor(){
        this.repository = PolymorphicRepositoryFactory.create();
    }

    async getUniqueId(polymorphic_table: string,polymorphic_id: string): Promise<string>{
        throw new Exception();
    }

    async getPolymorphicInfo(unique_id: string): Promise<PolymorphicInfo>{
        throw new Exception();
    }

    async exists(unique_id: string): Promise<boolean>{
        throw new Exception();
    }

    async save(message_id: string,polymorphicInfo: PolymorphicInfo): Promise<boolean>{
        throw new Exception();
    }

    async get(unique_id: string): Promise<PolymorphicInfo>{
        throw new Exception();
    }
}
export default new PolymorphicManager;