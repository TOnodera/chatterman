import IUserRepository from './IUserRepository';
import User from './User';
import Bcrypt from '../Utility/Bcrypt';
import Message from '../Message/Message';
import AuthenticationException from '../Exception/AuthenticationException';
import UserRegister from './UserRegister';
import UserFactory from './UserFactory';
import DomainException from '../Exception/DomainException';
import Exception from '../Exception/Exception';
import Config from '../../config';

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
        const [users]: any[] = await this.connector.query('SELECT users.id,users.name FROM users WHERE users.deleted_at is NULL AND id <> ? ORDER BY users.name',[Config.system.superuser]);
        const [accessable_rooms]: any[] = await this.connector.query('SELECT rooms.id,rooms.creater_id FROM rooms JOIN accessable_rooms ON accessable_rooms.room_id = rooms.id AND accessable_rooms.user_id = ? WHERE rooms.room_type = "directmessage" AND rooms.deleted_at IS NULL AND accessable_rooms.deleted_at IS NULL',[user_id]);
        const result: any[] = users.map( (user: any) => {
            let room_id = null;
            accessable_rooms.forEach( (room: any) => {
                if(user.id == room.creater_id){
                    room_id = room.id;
                }
            });
            return {
                id: user.id,
                name: user.name,
                room_id: room_id ? room_id : user.id
            };
        });
        return result;
    }

    async getInformationRoomId(user_id: string): Promise<string>{
        const [rows]: any[] = await this.connector.query("SELECT room_id FROM accessable_rooms WHERE user_id = ? AND deleted_at IS NULL",[user_id]);
        if(rows.length > 0){
            return rows[0].room_id;
        }
        throw new Exception("指定されたユーザーのルームIDは存在しません。");
    }

}
export default UserRepository;