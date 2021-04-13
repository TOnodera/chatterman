import { Pool } from "mysql2/promise";
import Exception from "../../../../Domain/Exception/Exception";
import { PolymorphicTables } from "../../../../enum/enum";

class ApplyPolymorphicRepository{

    private connector: Pool;

    constructor(connector: Pool){
        this.connector = connector;
    }

    async getRequestUserId(polymorphic_id: number): Promise<string>{
        const [rows]: any[] = await this.connector.query(`SELECT request_user FROM ${PolymorphicTables.requests} WHERE id = ? `, [polymorphic_id]);
        if(rows.length > 0){
            return rows[0].request_user;
        }
        throw new Exception("一致するデータがみつかりませんでした。");
    }    

}
export default ApplyPolymorphicRepository;