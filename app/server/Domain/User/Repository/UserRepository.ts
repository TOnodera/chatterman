import IUserRepository from './IUserRepository';
import Bcrypt from '../../../Utility/Bcrypt';
import AuthenticationException from '../../../Exception/AuthenticationException';
import Config from '../../../Config';
import { query } from '../../../Utility/Connection/Connection';
import logger from '../../../Utility/logger';
import IUserRegister from '../Interface/IUserRegister';

class UserRepository implements IUserRepository {
    async registe(user: IUserRegister): Promise<boolean> {
        const [result]: any[] = await query('INSERT INTO users SET id = ?, name = ?, email = ? , password = ? , type = ? , created_at = NOW() ', [user.id, user.name, user.credentials!.email, user.credentials!.password, user.type]);
        return result.affectedRows == 1;
    }

    async thisEmailIsAlreadyUsed(email: string): Promise<boolean> {
        const [rows]: any[] = await query('SELECT * FROM users WHERE email = ? ', [email]);
        return rows.length > 0;
    }

    async thisNameIsAlreadyUsed(name: string): Promise<boolean> {
        const [rows]: any[] = await query('SELECT * FROM users WHERE name = ? ', [name]);
        return rows.length > 0;
    }

    async getUserIdByCredentials(credentials: Credentials): Promise<string> {
        const [rows]: any[] = await query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
        logger.debug("条件分岐 -> ", rows.length > 0, credentials.password, (await Bcrypt.compare(credentials.password, rows[0].password)));
        if (rows.length > 0 && (await Bcrypt.compare(credentials.password, rows[0].password))) {
            logger.debug("一致する認証情報がありました。");
            return rows[0].id;
        }
        throw new AuthenticationException('認証情報に一致するユーザーが見つかりませんでした。');
    }

    async credentials(credentials: Credentials): Promise<boolean> {
        const [rows]: any[] = await query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
        if (rows.length > 0) {
            return await Bcrypt.compare(credentials.password, rows[0].password);
        }
        return false;
    }

    async get(user_id: string): Promise<any> {
        const [rows]: any[] = await query('SELECT * FROM users WHERE id = ? ', [user_id]);
        if (rows.length > 0) {
            const credentials: Credentials = {
                email: rows[0].email as string,
                password: rows[0].password as string
            };
            return {
                id: rows[0].id,
                name: rows[0].name,
                credentials: credentials,
                type: rows[0].type,
                created_at: rows[0].created_at
            };
        }
        throw new AuthenticationException('ユーザーが見つかりませんでした。');
    }

    async getMembersId(): Promise<string[]> {
        const [rows]: any[] = await query('SELECT users.id FROM users WHERE users.deleted_at is NULL AND id <> ? ORDER BY users.name', [Config.system.superuser]);
        return rows.map((data: any) => {
            return data.id;
        });
    }

    async delete(id: string): Promise<boolean> {
        const [rows]: any[] = await query('DELETE FROM users WHERE id = ?', [id]);
        return rows.affectedRows == 1;
    }
}
export default UserRepository;
