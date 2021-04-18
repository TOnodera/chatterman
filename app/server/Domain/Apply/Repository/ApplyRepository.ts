import { APPLY_REACTION, APPLY_SENDER_NOTICE } from '../../../Enum/Enum';
import logger from '../../../Utility/logger';
import Exception from '../../../Exception/Exception';
import { query } from '../../../Utility/Connection/Connection';

class ApplyRepository {
    async apply(target_id: string, user_id: string): Promise<string> {
        const [result]: any[] = await query('INSERT INTO requests SET target_user = ? ,request_user = ?, is_accept = ?, accept_notified = ?,created_at = NOW();', [target_id, user_id, APPLY_REACTION.IS_ACCEPT_UNTREATED, APPLY_SENDER_NOTICE.IS_NOTIFIED_YET]);
        return result.insertId;
    }

    async hasAlreadyRequested(target_id: string, user_id: string): Promise<boolean> {
        const [rows]: any[] = await query('SELECT * FROM requests WHERE target_user = ? AND request_user = ? AND deleted_at IS NULL ', [target_id, user_id]);
        return rows.length > 0;
    }

    async hasAccepted(target_id: string, user_id: string): Promise<boolean> {
        const [rows]: any[] = await query('SELECT * FROM requests WHERE target_user = ? AND request_user = ? AND deleted_at IS NULL ', [user_id, target_id]);
        return rows.length > 0;
    }

    async hasHandled(target_id: string, user_id: string): Promise<boolean> {
        const [rows]: any[] = await query('SELECT * FROM requests WHERE (( target_user = ? AND request_user = ? ) OR ( request_user = ? AND target_user = ? )) AND deleted_at IS NULL AND is_accept > 0', [target_id, user_id, target_id, user_id]);
        return rows.length > 0;
    }

    async getUserId(polymorphic_id: number): Promise<string> {
        const [rows]: any[] = await query('SELECT request_user FROM requests WHERE id = ?', [polymorphic_id]);
        if (rows.length > 0) {
            return rows[0].request_user;
        }
        throw new Exception('DM申請テーブル（requests）で申請IDに紐づくユーザーIDが取得出来ませんでした。想定されない処理です。');
    }

    async registeApplyReaction(polymorphicInfo: PolymorphicInfo, reaction: number): Promise<boolean> {
        const [result]: any[] = await query('UPDATE requests SET is_accept = ? WHERE id = ? ', [reaction, polymorphicInfo.polymorphic_id]);
        return result.affectedRows == 1;
    }

    async isThePerson(polymorphicInfo: PolymorphicInfo, user_id: string): Promise<boolean> {
        const [results]: any[] = await query(`SELECT * FROM  requests WHERE request_user = ? AND id = ? `, [user_id, polymorphicInfo.polymorphic_id]);
        return results.length == 1;
    }
}
export default ApplyRepository;
