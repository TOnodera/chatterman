import IUserRepository from './IUserRepository';
import User from '../User';
import Bcrypt from '../../Utility/Bcrypt';
import Message from '../../Message/Message';
import AuthenticationException from '../../Exception/AuthenticationException';
import UserRegister from '../UserRegister';
import UserFactory from '../Factory/UserFactory';
import DomainException from '../../Exception/DomainException';
import Config from '../../../config';
import { query } from '../../Utility/Connection/Connection';
import { ROOM_TYPE } from '../../../enum/enum';

class UserRepository implements IUserRepository {

    async registe(user: UserRegister): Promise<boolean> {
        const [result]: any[] = await query('INSERT INTO users SET id = ?, name = ?, email = ? , password = ? ,created_at = NOW() ', [user.id, user.name, user.credentials!.email, user.credentials!.password]);
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

    async getUserByCredentials(credentials: Credentials): Promise<User> {
        const [rows]: any[] = await query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
        if (rows.length > 0 && await Bcrypt.compare(credentials.password, rows[0].password)) {
            return await UserFactory.create(rows[0].id);
        }
        throw new AuthenticationException("認証情報に一致するユーザーが見つかりませんでした。");
    }

    async credentials(credentials: Credentials): Promise<boolean>{
        const [rows]: any[] = await query('SELECT * FROM users WHERE email = ? ', [credentials.email]);
        if (rows.length > 0){
            return await Bcrypt.compare(credentials.password, rows[0].password);
        }
        return false;
    }
    
    async hasMessage(message: Message): Promise<boolean> {
        const [rows] : any[] = await query("SELECT * FROM messages WHERE user_id = ? AND id = ?",[message.user?.id,message.message_id]);
        return rows.length > 0;
    }

    async get(user_id: string): Promise<any>{
        const [rows]: any[] = await query('SELECT * FROM users WHERE id = ? ',[user_id]);
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

    async getMembers(): Promise<any[]>{
        const [users]: any[] = await query('SELECT users.id,users.name FROM users WHERE users.deleted_at is NULL AND id <> ? ORDER BY users.name',[Config.system.superuser]);
        return users;
    }

}
export default UserRepository;