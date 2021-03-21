import IUserRepository from './IUserRepository';
import User from './User';
import { connector } from '../Utility/Connection';
import ExceptionHandeler from '../Exception/ExceptionHandler';
class UserRepository implements IUserRepository {

    async registe(user: User): Promise<boolean | void> {
        try {
            const [result]: any[] = await connector.query('INSERT INTO users SET id = ?, name = ?, email = ? , password = ? ,created_at = NOW() ', [user.id, user.name, user.credentials.email, user.credentials.password]);
            return result.length > 0;
        } catch (e) {
            ExceptionHandeler.handle(e);
        }
    }

    async getUserByEmail(email: string): Promise<void | User> {
        try {
            
            const [rows]: any[] = await connector.query('SELECT * FROM users WHERE email = ? ', [email]);
            if (rows.length > 0) {
                const credentials: Credentials = { email: rows[0].email, password: rows[0].passpword };
                return new User(
                    rows[0].name,
                    credentials,
                    rows[0].created_at,
                    rows[0].id
                );
            }

        } catch (e) {
            ExceptionHandeler.handle(e);
        }
    }
    async select(email: string): Promise<void | User> {
        try {
            const rows = await connector.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        } catch (e) {
            ExceptionHandeler.handle(e);
        }
    }
    async getUserByPassword(plainPassword: string): Promise<void | User> {

    }
    async getUserByName(name: string): Promise<void | User> {

    }
    getUserByCredentials(credentials: Credentials): Promise<void | User> {
        throw new Error('Method not implemented.');
    }
    hasMessage(message: Message): Promise<boolean | void> {
        throw new Error('Method not implemented.');
    }

}
export default UserRepository;