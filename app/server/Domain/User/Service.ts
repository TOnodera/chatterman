import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import User from './User';
import roomManager from '../Room/RoomManager';
import UserFactory from './Factory/UserFactory';

class Service {

    private repository: any;
    constructor() {
        this.repository = UserRepositoryFactory.create();
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

    async getMembersId(): Promise<string[]>{
        return await this.repository.getMembersId();
    }

    async getAllUsers(): Promise<User[]>{
        const idArray: string[] = await this.getMembersId();
        const users: User[] = await this.getUsersByIdArray(idArray);
        return users;
    }

}
export default new Service();