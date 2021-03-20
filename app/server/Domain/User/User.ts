import uuid from 'node-uuid';
import Datetime from '../Utility/Datetime';
import IUserRepository from './IUserRepository';
import UserRepositoryFactory from './UserRepositoryFactory';
class User{

    private id?: string;
    private credentials: Credentials;
    private name: string;
    private created_at?: Datetime;
    private accessableRooms: Array<string>;
    private repository: IUserRepository;

    constructor(user: User){
        this.id = user.id;
        this.credentials = user.credentials;
        this.name = user.name;
        this.accessableRooms = ['everybody'];
        this.repository = UserRepositoryFactory.create();
    }

    async registe(): Promise<boolean>{
        this.id = uuid.v4();
        try{
            return await this.repository.registe(this);
        }catch(exception){
            ExceptionHandler.handle(exception);
        }
        return false;
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