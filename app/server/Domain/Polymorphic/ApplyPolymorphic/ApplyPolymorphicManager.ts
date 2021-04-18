import UserEditor from '../../User/User';
import userManager from '../../User/UserManager';
import ApplyPolymorphicRepositoryFactory from './Factory/ApplyPolymorphicRepositoryFactory';
import ApplyPolymorphicRepository from './Repository/ApplyPolymorphicRepository';

/**
 * PolymorphicManager内で使用。
 * パッケージの外側から直接呼ばない
 */
class ApplyPolymorphicManager {
    private repository: ApplyPolymorphicRepository;
    constructor() {
        this.repository = ApplyPolymorphicRepositoryFactory.create();
    }

    async getRequestUser(polymorphic_id: number): Promise<UserEditor> {
        const request_user: string = await this.repository.getRequestUserId(polymorphic_id);
        const user: UserEditor = await userManager.getUserById(request_user);
        return user;
    }

    async getTargetUser(polymorphic_id: number): Promise<UserEditor> {
        const request_user: string = await this.repository.getTargetUserId(polymorphic_id);
        const user: UserEditor = await userManager.getUserById(request_user);
        return user;
    }
}

export default new ApplyPolymorphicManager();
