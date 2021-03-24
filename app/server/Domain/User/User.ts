import uuid from 'node-uuid';
import Datetime from '../Utility/Datetime';
import IUserRepository from './IUserRepository';
import UserRepositoryFactory from './UserRepositoryFactory';
import ExceptionHandler from '../Exception/ExceptionHandler';
import Bcrypt from '../Utility/Bcrypt';
import DomainException from '../Exception/DomainException';
import Message from '../Message/Message';

class User{

    id?: string;
    credentials: Credentials;
    name: string;
    created_at?: Datetime;
    accessableRooms: Array<string>;
    repository: IUserRepository;

    constructor(name: string,credentials: Credentials,created_at?: Datetime,id?: string){
        this.id = id;
        this.credentials = credentials;
        this.name = name;
        this.accessableRooms = ['everybody'];
        this.repository = UserRepositoryFactory.create();
    }

    async registe(): Promise<boolean | void>{
        try{
            if( await this.repository.thisEmailIsAlreadyUsed(this.credentials.email) ){
                throw new DomainException('このメールアドレスは使用されています。');
            }
            if( await this.repository.thisNameIsAlreadyUsed(this.name)){
                throw new DomainException('このユーザー名は使用されています。');
            }
            this.id = uuid.v4();
            this.credentials.password = await Bcrypt.hash(this.credentials.password);
            return await this.repository.registe(this);
        }catch(exception){
            ExceptionHandler.handle(exception);
        }
    }

    isAccessable(room_id: string): boolean{
        return this.accessableRooms.includes(room_id);
    }

    async isEditable(message: Message): Promise<boolean>{
        try{
            return await this.repository.hasMessage(message);
        }catch(exception){
            ExceptionHandler.handle(exception);
        }
        return false;
    }
}

export default User;