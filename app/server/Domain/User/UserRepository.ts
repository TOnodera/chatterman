import IUserRepository from './IUserRepository';
import User from './User';
import ExceptionHandeler from '../Exception/ExceptionHandler';
import Bcrypt from '../Utility/Bcrypt';

class UserRepository implements IUserRepository {

    private connector: any;

    constructor(connector: any) {
        this.connector = connector;
    }

    async registe(user: User): Promise<boolean | void> {
        try {
            const [result]: any[] = await this.connector.query('INSERT INTO users SET id = ?, name = ?, email = ? , password = ? ,created_at = NOW() ', [user.id, user.name, user.credentials.email, user.credentials.password]);
            return result.affectedRows == 1;
        } catch (e) {
            ExceptionHandeler.handle(e);
        }
    }

    async getUserByEmail(email: string): Promise<void | User> {
        try {

            const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE email = ? ', [email]);
            if (rows.length > 0) {
                const credentials: Credentials = { email: rows[0].email, password: rows[0].password };
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
    async getUserByName(name: string): Promise<void | User> {
        try {

            const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE name = ? ', [name]);
            if (rows.length > 0) {
                return new User(
                    rows[0].name,
                    { email: rows[0].email, password: rows[0].password },
                    rows[0].created_at,
                    rows[0].id
                );
            }

        } catch (e) {
            ExceptionHandeler.handle(e);
        }
    }
    async getUserByCredentials(credentials: Credentials): Promise<void | User> {
        try {

            const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
            if (rows.length > 0) {
                if (Bcrypt.compare(credentials.password, rows[0].password)) {
                    return new User(
                        rows[0].name,
                        { email: rows[0].email, password: rows[0].password },
                        rows[0].created_at,
                        rows[0].id
                    );
                }
            }

        } catch (e) {
            ExceptionHandeler.handle(e);
        }
    }
    hasMessage(message: Message): Promise<boolean | void> {
        throw new Error('Method not implemented.');
    }

}
export default UserRepository;