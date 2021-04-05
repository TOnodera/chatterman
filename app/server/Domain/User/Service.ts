import UserRepositoryFactory from './UserRepositoryFactory';
import loginUsersStore from '../../Store/LoginUsersStore';
import { Client } from 'server/@types/types';
import User from './User';
class Service{

    private repository: any;
    constructor(){
        this.repository = UserRepositoryFactory.create();
    }

    async getUsers(): Promise<Client[]>{
        const users: Client[] = await this.repository.getUsers();
        for(let user of users){
            if(loginUsersStore.inUsers(user.id)){
                user.isLogin = true;
            }else{
                user.isLogin = false;
            }
        }
        return users;
    }

    async getUserByCredentials(credentials: Credentials): Promise<User>{
        return await this.repository.getUserByCredentials(credentials);
    }
}
export default new Service();