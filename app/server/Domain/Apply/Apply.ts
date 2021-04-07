import factory from './ApplyRepositoryFactory';
class Apply{

    private repository: any;

    constructor(){
        this.repository = factory.create();
    }

    async apply(target_id: string,user_id: string){
        this.repository.apply(target_id,user_id);
    }

    async hasAlreadyRequested(target_id: string,user_id: string): Promise<boolean>{
        return await this.repository.hasAlreadyRequested(target_id,user_id);
    }

    async hasAccepted(target_id: string,user_id: string): Promise<boolean>{
        return await this.repository.hasAccepted(target_id,user_id);
    }

}

export default new Apply;