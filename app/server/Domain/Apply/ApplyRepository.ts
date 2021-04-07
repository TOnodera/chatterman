class ApplyRepository{

    private connector: any;

    //受信者の許可フラグ
    private IS_ACCEPT_UNTREATED = 0; //未処理
    private IS_ACCEPT_ARROW = 1; //OK
    private IS_ACCEPT_DENY = 2; //NO

    //送信者への許可表示完了フラグ
    private IS_NOTIFIED_YET = 1; //未完了
    private IS_NOTIFIED_DONE = 2; //完了


    constructor(connector: any){
        this.connector = connector;
    }

    async apply(target_id: string,user_id: string){
        const [row]: any[] = await this.connector.query('INSERT INTO requests SET accept_user = ? ,request_user = ?, is_accept = ?, accept_notified = ?,created_at = NOW();',[target_id,user_id,this.IS_ACCEPT_UNTREATED,this.IS_NOTIFIED_YET]);
        return row.affectedRows == 1;
    }

    async hasAlreadyRequested(target_id: string,user_id: string): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM requests WHERE target_user = ? AND request_user = ? deleted_at IS NULL ', [target_id,user_id]);        
        return rows.length > 0;
    }

    async hasAccepted(target_id: string,user_id: string): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM requests WHERE target_user = ? AND request_user = ? deleted_at IS NULL ', [user_id,target_id]);        
        return rows.length > 0;
    }

}
export default ApplyRepository;