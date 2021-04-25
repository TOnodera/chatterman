import User from '../../User/User';
import userService from '../../User/Service';
import ApplyPolymorphicRepositoryFactory from './Factory/ApplyPolymorphicRepositoryFactory';
import ApplyPolymorphicRepository from './Repository/ApplyPolymorphicRepository';
import IUser from '../../../Domain/User/Interface/IUser';

/**
 * PolymorphicManager内で使用。
 * パッケージの外側から直接呼ばない
 */
class ApplyPolymorphicManager {
    private repository: ApplyPolymorphicRepository;
    constructor() {
        this.repository = ApplyPolymorphicRepositoryFactory.create();
    }

    async getRequestUser(polymorphic_id: number): Promise<IUser> {
        const request_user: string = await this.repository.getRequestUserId(polymorphic_id);
        const user: IUser = await userService.getUserById(request_user);
        return user;
    }

    async getTargetUser(polymorphic_id: number): Promise<IUser> {
        const request_user: string = await this.repository.getTargetUserId(polymorphic_id);
        const user: IUser = await userService.getUserById(request_user);
        return user;
    }
}

export default new ApplyPolymorphicManager();
