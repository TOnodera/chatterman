import IUserRepository from './IUserRepository';
import User from './User';
import ExceptionHandeler from '../Exception/ExceptionHandler';
import Bcrypt from '../Utility/Bcrypt';
import Exception from '../Exception/Exception';
import AuthenticationException from '../Exception/AuthenticationException';

class UserRepository implements IUserRepository {

    private connector: any;

    constructor(connector: any) {
        this.connector = connector;
    }

    async registe(user: User): Promise<boolean> {
        const [result]: any[] = await this.connector.query('INSERT INTO users SET id = ?, name = ?, email = ? , password = ? ,created_at = NOW() ', [user.id, user.name, user.credentials.email, user.credentials.password]);
        return result.affectedRows == 1;
    }

    async thisEmailIsAlreadyUsed(email: string): Promise<boolean> {
        const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE email = ? ', [email]);
        return rows.length > 0;
    }

    async thisNameIsAlreadyUsed(name: string): Promise<boolean> {
        const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE name = ? ', [name]);
        return rows.length > 0;
    }

    async getUserByCredentials(credentials: Credentials): Promise<User> {
        const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
        if (rows.length > 0 && Bcrypt.compare(credentials.password, rows[0].password)) {
            return new User(
                rows[0].name,
                { email: rows[0].email, password: rows[0].password },
                rows[0].created_at,
                rows[0].id
            );
        }
        throw new AuthenticationException("認証情報に一致するユーザーが見つかりませんでした。");
    }
    
    hasMessage(message: Message): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

}
export default UserRepository;