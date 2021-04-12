import { Pool } from "mysql2/promise";
import Exception from "../../Exception/Exception";

class ApplyRepository{

    private connector: Pool;

    constructor(connector: Pool){
        this.connector = connector;
    }

    async apply(target_id: string,user_id: string): Promise<string>{
        const [row]: any[] = await this.connector.query('INSERT INTO requests SET target_user = ? ,request_user = ?, is_accept = ?, accept_notified = ?,created_at = NOW();',[target_id,user_id,APPLY_REACTION.IS_ACCEPT_UNTREATED,APPLY_SENDER_NOTICE.IS_NOTIFIED_YET]);
        return row.insertId;
    }

    async hasAlreadyRequested(target_id: string,user_id: string): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM requests WHERE target_user = ? AND request_user = ? AND deleted_at IS NULL ', [target_id,user_id]);        
        return rows.length > 0;
    }

    async hasAccepted(target_id: string,user_id: string): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM requests WHERE target_user = ? AND request_user = ? AND deleted_at IS NULL ', [user_id,target_id]);        
        return rows.length > 0;
    }

    async getUserId(apply_id: string): Promise<string>{
        const [rows]: any[] = await this.connector.query("SELECT request_user FROM requests WHERE id = ?",[apply_id]);
        if(rows.length > 0){
            return rows[0].request_user;
        }        
        throw new Exception("DM申請テーブル（requests）で申請IDに紐づくユーザーIDが取得出来ませんでした。想定されない処理です。");
    }

    async registeApplyReaction(unique_id: string, reaction: number): Promise<boolean> {
        const [row]: any[] = await this.connector.query('SELECT message_id,polymorphic_table as table FROM message_polymorphics WHERE id = ? ',[unique_id]);
        const message_id = row.message_id;
        if(row.length == 1 && row.table == 'requests'){ //ハードコーディングなおす
            const [row]: any[] = await this.connector.query('UPDATE requests SET is_accept = ? WHERE message_id = ? ',[reaction,message_id]);
            return row.affectedRows == 1;
        }
        throw new Exception("unique_idに一致するデータが見つかりませんでした。");
    }

    async isThePerson(unique_id: string, user_id: string): Promise<boolean> {
        const [row]: any[] = await this.connector.query('SELECT * FROM message_polymorphics WHERE id = ? ',[unique_id]);
        const message_id = row.message_id;
        const options: MessageOptions = {polymorphic_table: row.polymorphic_table,unique_id: row.unique_id};
        
        if(row.length == 1){
            const [rows]: any[] = await this.connector.query(`SELECT * FROM  ${options.polymorphic_table} WHERE message_id = ? AND user_id = ?`,[message_id,user_id]);
            return rows.length == 1;
        }
        throw new Exception("unique_idに一致するデータが見つかりませんでした。");
    }

}
export default ApplyRepository;