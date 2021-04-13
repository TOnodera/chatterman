import ApplyRepositoryFactory from './Factory/ApplyRepositoryFactory';
import ApplyRepository from './Repository/ApplyRepository';
import apply from './Apply';
import { APPLY_REACTION } from '../../enum/enum';

class ApplyService{

    private repository: ApplyRepository;

    constructor(){
        this.repository = ApplyRepositoryFactory.create();        
    }

    makeMessage(name: string){
        return `
            ${name}さんからダイレクトメッセージの許可申請が届きました。
        `;
    }

    async hasAlreadyRequested(target_id: string,user_id: string): Promise<boolean>{
        return await this.repository.hasAlreadyRequested(target_id,user_id);
    }

    async hasAccepted(target_id: string,user_id: string): Promise<boolean>{
        return await this.repository.hasAccepted(target_id,user_id);
    }

    async registeApplication(target_id: string,user_id: string): Promise<number>{
        const polymorphic_id: number = await apply.apply(target_id, user_id);
        return polymorphic_id;

    }

    async registeApplyReaction(unique_id: string,reaction: number): Promise<boolean>{
        return await this.repository.registeApplyReaction(unique_id, reaction);
    }

    async isThePerson(unique_id: string,user_id: string): Promise<boolean>{
        return await this.repository.isThePerson(unique_id,user_id);
    }

    messageTxt(name: string,reaction: APPLY_REACTION){
        return reaction == APPLY_REACTION.IS_ACCEPT_ARROW
        ? `${name}さんへのDM申請が許可されました。`
        : `${name}さんへのDM申請が拒否されました。`;
    }

}

export default new ApplyService;