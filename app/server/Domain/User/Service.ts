import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import IUserEditor from './Interface/IUserEditor';
import Room from '../Room/Room';
import UserFactory from './Factory/UserFactory';
import logger from '../../Utility/logger';

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
        const room = new Room();
        return await room.getInformationRoomId(user_id);
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

    async delete(id: string) {
        this.repository.delete(id);
    }

}
export default new Service;
