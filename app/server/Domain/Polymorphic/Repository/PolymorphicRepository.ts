import { Pool } from "mysql2/promise";
import Exception from "server/Domain/Exception/Exception";

class PolymorphicRepository{

    private connector: Pool;

    constructor(connector: Pool){
        this.connector = connector;
    }

    async getUniqueId(polymorphic_table: string,polymorphic_id: string): Promise<string>{
        const [rows]: any[] = await this.connector.query('SELECT unique_id FROM message_polymorphics WHERE polymorphic_table = ? AND polymorphic_id = ? ', [polymorphic_table,polymorphic_id]);
        if(rows.length > 0){
            return rows[0].unique_id;
        }
        throw new Exception("一致するデータがみつかりませんでした。");
    }

    async getPolymorphicInfo(unique_id: string): Promise<PolymorphicInfo>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM message_polymorphics WHERE unique_id = ? ', [unique_id]);
        if(rows.length > 0){
            const polymorphicInfo: PolymorphicInfo = {
                polymorphic_table: rows[0].polymorphic_table,
                polymorphic_id: rows[0].polymorphic_id
            };
            return polymorphicInfo;
        }
        throw new Exception("一致するデータがみつかりませんでした。");
    }

    async save(message_id: string,polymorphicInfo: PolymorphicInfo): Promise<string>{
        const [rows]: any[] = await this.connector.query("INSERT INTO message_polymorphics SET message_id = ?,polymorphic_table = ?, polymorphic_id = ?,created_at = NOW()",[message_id,polymorphicInfo.polymorphic_table,polymorphicInfo.polymorphic_id]);
        return rows.insertId;
    }

    async getMessageId(unique_id: string): Promise<string>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM message_polymorphics WHERE unique_id = ? ', [unique_id]);
        if(rows.length > 0){
            return rows[0].message_id;
        }
        throw new Exception("一致するデータがみつかりませんでした。");
    }
    

}
export default PolymorphicRepository;