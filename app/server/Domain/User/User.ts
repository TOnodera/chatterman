import uuid from 'node-uuid';
import Datetime from '../Utility/Datetime';
import IUserRepository from './IUserRepository';
import UserRepositoryFactory from './UserRepositoryFactory';
import ExceptionHandler from '../Exception/ExceptionHandler';
import Bcrypt from '../Utility/Bcrypt';
import DomainException from '../Exception/DomainException';
import Message from '../Message/Message';
import Exception from '../Exception/Exception';

class User {

    id?: string;
    credentials?: Credentials;
    name?: string;
    created_at?: Datetime;
    accessableRooms: Array<string>;
    repository: IUserRepository;

    constructor(user_id: string);
    constructor(name_or_user_id: string, credentials?: Credentials, created_at?: Datetime, id?: string) {
        this.repository = UserRepositoryFactory.create();
        this.accessableRooms = ['everybody'];
        if (name_or_user_id && credentials) {
            this.id = id;
            this.credentials = credentials;
            this.name = name_or_user_id;
        }
        if(name_or_user_id && !credentials){
            this.id = name_or_user_id;
        }
        
    }

    async load(): Promise<boolean>{
        if(!this.id){
            throw new Exception('IDがない状態でload()を呼び出せません。');
        }
        const {user,exists} = await this.repository.get(this.id);
        if(exists){
            this.name = user?.name;
            this.credentials = user?.credentials;
            this.created_at = user?.created_at;
            return true;
        }
        return false;
    }

    async get(id: string): Promise<{user?: User,exists: boolean}>{
        return await this.load() ? {user: this,exists: true} : {exists: false};
    }

    async registe(): Promise<boolean | void> {
        if(!this.credentials || !this.name){
            throw new Exception('このインスタンスを生成したコンストラクタではこのメソッドは呼び出せません。');
        }
        try {
            if (await this.repository.thisEmailIsAlreadyUsed(this.credentials.email)) {
                throw new DomainException('このメールアドレスは使用されています。');
            }
            if (await this.repository.thisNameIsAlreadyUsed(this.name)) {
                throw new DomainException('このユーザー名は使用されています。');
            }
            this.id = uuid.v4();
            this.credentials.password = await Bcrypt.hash(this.credentials.password);
            return await this.repository.registe(this);
        } catch (exception) {
            ExceptionHandler.handle(exception);
        }
    }

    isAccessable(room_id: string): boolean {
        return this.accessableRooms.includes(room_id);
    }

    async isEditable(message: Message): Promise<boolean> {
        try {
            return await this.repository.hasMessage(message);
        } catch (exception) {
            ExceptionHandler.handle(exception);
        }
        return false;
    }
}

export default User;