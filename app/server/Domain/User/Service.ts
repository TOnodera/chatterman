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

    async getMembers(my_id: string): Promise<Client[]> {
        
        const user_ids: string[] = await this.repository.getMembers();

        const users: Client[] = [];
        for(const user_id of user_ids){
            const user: User = await this.getUserById(user_id);
            const result: Client = {id: user.id, name: user.name };
            const room: Room | null = await roomManager.getDirectMessageRoom(user.id,my_id);
            result.room_id = room ? room.id : user.id;
            result.isLogin = loginUsersStore.inUsers(user.id);
            users.push(result);
        }

        return users;
    }

    //TODO 実装やりなおし
    async getUserByCredentials(credentials: Credentials): Promise<User> {
        return await this.repository.getUserByCredentials(credentials);
    }

    async getInfromationRoomId(user_id: string): Promise<string> {
        return await roomManager.getInformationRoomId(user_id);
    }

    async getUserById(user_id: string): Promise<User> {
        return await UserFactory.create(user_id);
    }
}
export default new Service();