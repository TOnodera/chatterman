import UserRepositoryFactory from './UserRepositoryFactory';
import loginUsersStore from '../../Store/LoginUsersStore';
import { Client } from 'server/@types/types';
import User from './User';
import logger from '../Utility/logger';
class Service{

    private repository: any;
    constructor(){
        this.repository = UserRepositoryFactory.create();
    }

    async getUsers(): Promise<Client[]>{
        logger.info('1/3 User/Service.getUsers() -> ユーザー情報取得開始');
        const users: Client[] = await this.repository.getUsers();
        logger.info('2/3 User/Service.getUsers() -> ログイン中のユーザー情報取得開始');
        for(let user of users){
            if(loginUsersStore.inUsers(user.id)){
                user.isLogin = true;
            }else{
                user.isLogin = false;
            }
        }
        logger.info('3/3 User/Service.getUsers() -> return users;');
        return users;
    }

    async getUserByCredentials(credentials: Credentials): Promise<User>{
        return await this.repository.getUserByCredentials(credentials);
    }
}
export default new Service();