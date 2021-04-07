
class ApplyRepository{

    private connector: any;

    constructor(connector: any){
        this.connector = connector;
    }

    async apply(target_id: string,user_id: string){
        
    }

    async hasAlreadyRequested(target_id: string,user_id: string): Promise<boolean>{

    }

    async hasAccepted(target_id: string,user_id: string): Promise<boolean>{

    }

}