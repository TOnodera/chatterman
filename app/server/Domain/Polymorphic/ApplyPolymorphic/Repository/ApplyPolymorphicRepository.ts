import { query } from '../../../../Utility/Connection/Connection';
import Exception from '../../../../Exception/Exception';
import { PolymorphicTables } from '../../../../Enum/Enum';

class ApplyPolymorphicRepository {
    async getRequestUserId(polymorphic_id: number): Promise<string> {
        const [rows]: any[] = await query(`SELECT request_user FROM ${PolymorphicTables.requests} WHERE id = ? `, [polymorphic_id]);
        if (rows.length > 0) {
            return rows[0].request_user;
        }
        throw new Exception('一致するデータがみつかりませんでした。');
    }

    async getTargetUserId(polymorphic_id: number): Promise<string> {
        const [rows]: any[] = await query(`SELECT target_user FROM ${PolymorphicTables.requests} WHERE id = ? `, [polymorphic_id]);
        if (rows.length > 0) {
            return rows[0].target_user;
        }
        throw new Exception('一致するデータがみつかりませんでした。');
    }
}
export default ApplyPolymorphicRepository;
