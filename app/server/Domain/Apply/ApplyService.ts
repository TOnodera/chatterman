
import Config from '../../config';
import ApplyRepositoryFactory from './Factory/ApplyRepositoryFactory';
import ApplyRepository from './Repository/ApplyRepository';
import apply from './Apply';

class ApplyService{

    private repository: ApplyRepository;

    constructor(){
        this.repository = ApplyRepositoryFactory.create();        
    }

    makeMessage(name: string,polymorphic_id: number,request_user: string){
        return `
            ${name}さんからダイレクトメッセージの許可申請が届きました。
            リンクをクリックして申請を処理して下さい。
            ${Config.system.baseUrl}/api/applys/${polymorphic_id}/${request_user}
        `;
    }

    async hasAlreadyRequested(target_id: string,user_id: string): Promise<boolean>{
        return await this.repository.hasAlreadyRequested(target_id,user_id);
    }

    async hasAccepted(target_id: string,user_id: string): Promise<boolean>{
        return await this.repository.hasAccepted(target_id,user_id);
    }

    async registeApplication(target_id: string,user_id: string): Promise<MessageOptions>{
        const apply_id: number = await apply.apply(target_id, user_id);
        const options: MessageOptions = { polymorphic_table: 'requests',polymorphic_id: apply_id };
        return options;
    }

    async registeApplyReaction(unique_id: string,reaction: number): Promise<boolean>{
        return await this.repository.registeApplyReaction(unique_id, reaction);
    }

    async isThePerson(unique_id: string,user_id: string): Promise<boolean>{
        return await this.repository.isThePerson(unique_id,user_id);
    }

}

export default new ApplyService;