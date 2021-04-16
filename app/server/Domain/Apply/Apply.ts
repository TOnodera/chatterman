import factory from './Factory/ApplyRepositoryFactory';

class Apply {
    private repository: any;

    constructor() {
        this.repository = factory.create();
    }

    async apply(target_id: string, user_id: string): Promise<number> {
        return await this.repository.apply(target_id, user_id);
    }
}

export default new Apply();
