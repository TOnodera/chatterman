import { query } from "../../Utility/Connection/Connection";
import logger from "../../../Domain/Utility/logger";
import Exception from "../../../Domain/Exception/Exception";

class PolymorphicRepository{

    async getUniqueId(polymorphicInfo: PolymorphicInfo): Promise<number>{
        const [rows]: any[] = await query('SELECT unique_id FROM message_polymorphics WHERE polymorphic_table = ? AND polymorphic_id = ? ', [polymorphicInfo.polymorphic_table,polymorphicInfo.polymorphic_id]);
        if(rows.length > 0){
            return rows[0].unique_id;
        }
        throw new Exception("一致するデータがみつかりませんでした。");
    }

    async getPolymorphicInfo(unique_id: number): Promise<PolymorphicInfo>{
        const [rows]: any[] = await query('SELECT * FROM message_polymorphics WHERE unique_id = ? ', [unique_id]);
        if(rows.length > 0){
            const polymorphicInfo: PolymorphicInfo = {
                polymorphic_table: rows[0].polymorphic_table,
                polymorphic_id: rows[0].polymorphic_id
            };
            return polymorphicInfo;
        }
        throw new Exception("一致するデータがみつかりませんでした。");
    }

    async save(message_id: string,polymorphicInfo: PolymorphicInfo): Promise<boolean>{
        const [rows]: any[] = await query("INSERT INTO message_polymorphics SET message_id = ?,polymorphic_table = ?, polymorphic_id = ?,created_at = NOW()",[message_id,polymorphicInfo.polymorphic_table,polymorphicInfo.polymorphic_id]);
        return rows.affectedRows == 1;
    }

    async getMessageId(unique_id: number): Promise<string>{
        const [rows]: any[] = await query('SELECT * FROM message_polymorphics WHERE unique_id = ? ', [unique_id]);
        if(rows.length > 0){
            return rows[0].message_id;
        }
        throw new Exception("一致するデータがみつかりませんでした。");
    }

    async getUniqueIdByMessageId(message_id: string): Promise<number | null>{
        const [rows]: any[] = await query('SELECT unique_id FROM message_polymorphics WHERE message_id = ? ', [message_id]);
        if(rows.length > 0){
            return rows[0].unique_id;
        }
        return null;
    }
    

}
export default PolymorphicRepository;