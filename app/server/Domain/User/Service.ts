import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import IUser from './Interface/IUser';
import Room from '../Room/Room';
import UserFactory from './Factory/UserFactory';
import logger from '../../Utility/logger';

class Service {

    private repository: any;

    constructor() {
        this.repository = UserRepositoryFactory.create();
    }

    async getUserByCredentials(credentials: Credentials): Promise<IUser> {
        const id: string = await this.repository.getUserIdByCredentials(credentials);
        return UserFactory.create(id);
    }


    async getUserById(user_id: string): Promise<IUser> {
        return await UserFactory.create(user_id);
    }

    async getUsersByIdArray(user_ids: string[]): Promise<IUser[]> {
        const users: IUser[] = [];
        for (const id of user_ids) {
            const user: IUser = await this.getUserById(id);
            users.push(user);
        }
        return users;
    }

    async getMembersId(): Promise<string[]> {
        return await this.repository.getMembersId();
    }

    async getAllUsers(): Promise<IUser[]> {
        const idArray: string[] = await this.getMembersId();
        const users: IUser[] = await this.getUsersByIdArray(idArray);
        return users;
    }

    async delete(id: string) {
        this.repository.delete(id);
    }

}
export default new Service;
