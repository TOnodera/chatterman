import uuid from 'node-uuid';
import Datetime from '../Utility/Datetime';
import IUserRepository from './IUserRepository';
import UserRepositoryFactory from './UserRepositoryFactory';
import ExceptionHandler from '../Exception/ExceptionHandler';
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
        this.id = uuid.v4();
        try{
            return await this.repository.registe(this);
        }catch(exception){
            ExceptionHandler.handle(exception);
        }
    }

    isAccessable(room_id: string): boolean{
        return this.accessableRooms.includes(room_id);
    }

    async isEditable(message: Message): Promise<boolean | void>{
        try{
            return await this.repository.hasMessage(message);
        }catch(exception){
            ExceptionHandler.handle(exception);
        }
        return false;
    }
}

export default User;