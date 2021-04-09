import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import loginUsersStore from '../../Store/LoginUsersStore';
import { Client } from 'server/@types/types';
import User from './User';
import logger from '../Utility/logger';
import roomManager from '../Room/RoomManager';

class Service{

    private repository: any;
    constructor(){
        this.repository = UserRepositoryFactory.create();
    }

    async getMembers(user_id: string): Promise<Client[]>{
        logger.info('1/3 User/Service.getMembers() -> ユーザー情報取得開始');
        const users: Client[] = await this.repository.getMembers(user_id);
        logger.info('2/3 User/Service.getMembers() -> ログイン中のユーザー情報取得開始');
        for(let user of users){
            if(loginUsersStore.inUsers(user.id)){
                user.isLogin = true;
            }else{
                user.isLogin = false;
            }
        }
        logger.info('3/3 User/Service.getMembers() -> return users;');
        return users;
    }

    async getUserByCredentials(credentials: Credentials): Promise<User>{
        return await this.repository.getUserByCredentials(credentials);
    }

    async getInfromationRoomId(user_id: string): Promise<string>{
        return await roomManager.getInformationRoomId(user_id);
    }
}
export default new Service();