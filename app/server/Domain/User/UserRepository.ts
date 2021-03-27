import IUserRepository from './IUserRepository';
import User from './User';
import Bcrypt from '../Utility/Bcrypt';
import Message from '../Message/Message';
import AuthenticationException from '../Exception/AuthenticationException';

class UserRepository implements IUserRepository {

    private connector: any;

    constructor(connector: any) {
        this.connector = connector;
    }

    async registe(user: User): Promise<boolean> {
        const [result]: any[] = await this.connector.query('INSERT INTO users SET id = ?, name = ?, email = ? , password = ? ,created_at = NOW() ', [user.id, user.name, user.credentials!.email, user.credentials!.password]);
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

    async credentials(credentials: Credentials): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
        if (rows.length > 0){
            return Bcrypt.compare(credentials.password, rows[0].password);
        }
        return false;
    }
    
    async hasMessage(message: Message): Promise<boolean> {
        const [rows] : any[] = await this.connector.query("SELECT * FROM messages WHERE user_id = ? AND message_id = ?",[message.user?.id,message.message_id]);
        return rows.length > 0;
    }

    async get(user_id: string): Promise<{user?: User,exists: boolean}>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE id = ? ',[user_id]);
        console.log(user_id,rows);
        if(rows.length > 0){
            const user: User = new User(rows[0].name,{email: rows[0].email,password: rows[0].password},rows[0].created_at,rows[0].id);
            return {user: user,exists: true};
        }
        return {exists: false};
    }

}
export default UserRepository;