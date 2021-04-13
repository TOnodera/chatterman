import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import loginUsersStore from '../../Store/LoginUsersStore';
import User from './User';
import logger from '../Utility/logger';
import roomManager from '../Room/RoomManager';
import UserFactory from './Factory/UserFactory';
import Room from '../Room/Room';

class Service {

    private repository: any;
    constructor() {
        this.repository = UserRepositoryFactory.create();
    }

    async getDirectMessageRoomInfo(my_id: string): Promise<Client[]> {
        
        const ids: string[] = await this.repository.getMembersId();
        const users: User[] = await this.getUsersByIdArray(ids);

        const members: Client[] = [];
        for(const user of users){
            const result: Client = {id: user.id, name: user.name };
            logger.debug("my_id,user.id",my_id,user.id);
            const room: Room | null = await roomManager.getDirectMessageRoom(user.id,my_id);
            
            result.room_id = room ? room.id : user.id;
            result.isLogin = loginUsersStore.inUsers(user.id);
            members.push(result);
        }

        logger.debug("members->",members);

        return members;
    }

    async getUserByCredentials(credentials: Credentials): Promise<User> {
        const id: string = await this.repository.getUserIdByCredentials(credentials);
        return UserFactory.create(id);
    }

    async getInfromationRoomId(user_id: string): Promise<string> {
        return await roomManager.getInformationRoomId(user_id);
    }

    async getUserById(user_id: string): Promise<User> {
        return await UserFactory.create(user_id);
    }

    async getUsersByIdArray(user_ids: string[]): Promise<User[]>{
        const users: User[] = [];
        for(const id of user_ids){
            const user: User = await this.getUserById(id);
            users.push(user);
        }
        return users;
    }
}
export default new Service();