import ApplyRepositoryFactory from "../Apply/Factory/ApplyRepositoryFactory";
import ApplyRepository from "../Apply/Repository/ApplyRepository";
import Exception from "../Exception/Exception";
import MessageOptionsRepositoryFactory from "./Factory/MessageOptionsRepositoryFactory";
import MessageOptionsRepository from "./Repository/MessageOptionsRepository";

class FindMessageOption{

    private messageOptionsRepository: MessageOptionsRepository;
    private applyRepository: ApplyRepository;

    constructor(){
        this.messageOptionsRepository = MessageOptionsRepositoryFactory.create();
        this.applyRepository = ApplyRepositoryFactory.create();
    }

    /**
     * 
     * @param unique_id 
     * @throwable 
     * @returns ApprovalOptions 
     * 
     * message_polymorphicsのunique_idから必要な情報を取得してクライアントに渡すオブジェクトを作る
     * 追加機能がメッセージに関連する追加機能が増えたら戻り値のoptionに型を追加する
     */
    async getMessageOptionById(unique_id: string): Promise<ApproveOptions>{
        const options: MessageOptions = await this.messageOptionsRepository.get(unique_id);
        switch(options.polymorphic_table){
            case 'requests':
                const user_id: string = await this.applyRepository.getUserId(unique_id);
                return {unique_id: unique_id,user_id: user_id} as ApproveOptions;    
            default:
                throw new Exception("message_polymorphics.polymorphic_tableに不正な値が設定されました。");
        }
    }
}

export default new FindMessageOption;