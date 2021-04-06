import IUserRepository from './IUserRepository';
import User from './User';
import Bcrypt from '../Utility/Bcrypt';
import Message from '../Message/Message';
import AuthenticationException from '../Exception/AuthenticationException';
import UserRegister from './UserRegister';
import UserFactory from './UserFactory';
import DomainException from '../Exception/DomainException';

class UserRepository implements IUserRepository {

    private connector: any;

    constructor(connector: any) {
        this.connector = connector;
    }

    async registe(user: UserRegister): Promise<boolean> {
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
        if (rows.length > 0 && await Bcrypt.compare(credentials.password, rows[0].password)) {
            return await UserFactory.create(rows[0].id);
        }
        throw new AuthenticationException("認証情報に一致するユーザーが見つかりませんでした。");
    }

    async credentials(credentials: Credentials): Promise<boolean>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
        if (rows.length > 0){
            return await Bcrypt.compare(credentials.password, rows[0].password);
        }
        return false;
    }
    
    async hasMessage(message: Message): Promise<boolean> {
        const [rows] : any[] = await this.connector.query("SELECT * FROM messages WHERE user_id = ? AND id = ?",[message.user?.id,message.message_id]);
        return rows.length > 0;
    }

    async get(user_id: string): Promise<any>{
        const [rows]: any[] = await this.connector.query('SELECT * FROM users WHERE id = ? ',[user_id]);
        if(rows.length > 0){
            const credentials: Credentials = {
                email: rows[0].email as string,
                password: rows[0].password as string
            };
            return {
                id: rows[0].id,
                name: rows[0].name,
                credentials: credentials,
                created_at: rows[0].created_at
            };
        }
        throw new DomainException("ユーザーが見つかりませんでした。");
    }

    async getMembers(user_id: string): Promise<any[]>{
        const [rows]: any[] = await this.connector.query('SELECT users.id,users.name,rooms.id as room_id FROM users JOIN rooms ON rooms.creater_id = users.id AND rooms.room_type = "directmessage" LEFT JOIN accessable_rooms ON user_id = ? AND room_id = rooms.id WHERE users.deleted_at is NULL ORDER BY users.name',[user_id]);
        return rows.length > 0 ? rows : []
    }

}
export default UserRepository;