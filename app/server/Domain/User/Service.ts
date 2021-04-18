import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import IUserEditor from './Interface/IUserEditor';
import roomManager from '../Room/RoomManager';
import UserFactory from './Factory/UserFactory';

class Service {

    private repository: any;

    constructor() {
        this.repository = UserRepositoryFactory.create();
    }

    async getUserByCredentials(credentials: Credentials): Promise<IUserEditor> {
        const id: string = await this.repository.getUserIdByCredentials(credentials);
        return UserFactory.create(id);
    }

    async getInfromationRoomId(user_id: string): Promise<string> {
        return await roomManager.getInformationRoomId(user_id);
    }

    async getUserById(user_id: string): Promise<IUserEditor> {
        return await UserFactory.create(user_id);
    }

    async getUsersByIdArray(user_ids: string[]): Promise<IUserEditor[]> {
        const users: IUserEditor[] = [];
        for (const id of user_ids) {
            const user: IUserEditor = await this.getUserById(id);
            users.push(user);
        }
        return users;
    }

    async getMembersId(): Promise<string[]> {
        return await this.repository.getMembersId();
    }

    async getAllUsers(): Promise<IUserEditor[]> {
        const idArray: string[] = await this.getMembersId();
        const users: IUserEditor[] = await this.getUsersByIdArray(idArray);
        return users;
    }

}
export default new Service;
