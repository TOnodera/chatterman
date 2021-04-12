import IMessageOptionsRepository from "./IMessageOptionsRepository";
import { Pool } from "mysql2/promise";
import Exception from "../../Exception/Exception";

class MessageOptionsRepository implements IMessageOptionsRepository{
    
    private connector: Pool;

    constructor(connector: Pool){
        this.connector = connector;
    }
    
    async add(message_id: string,messageOption: MessageOptions): Promise<boolean> {
        const [rows]: any[] = await this.connector.query("INSERT INTO message_polymorphics SET message_id = ?,polymorphic_table = ?, polymorphic_id = ?,created_at = NOW()",[message_id,messageOption.polymorphic_table,messageOption.polymorphic_id]);
        return rows.affectedRows == 1;
    }

    async get(unique_id: number): Promise<MessageOptions>{
        const [rows]: any[] = await this.connector.query("SELECT * FROM message_polymorphics WHERE unique_id = ?",[unique_id]);
        if(rows.length > 0){
            const result = rows[0];
            return {polymorphic_table: result.polymorphic_table,polymorphic_id: result.polymorphic_id} as  MessageOptions;
        }
        throw new Exception('ポリモーフィック関連テーブルに指定されたIDのデータがありませんでした。');
    }
}

export default MessageOptionsRepository;