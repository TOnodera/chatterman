import IUserEditor from '../Interface/IUserEditor';
import UserEditor from '../UserEditor';
import repositoryFactory from './UserRepositoryFactory';
class UserFactory {
    static async create(id: string): Promise<IUserEditor> {
        const repository = await repositoryFactory.create();
        const row: any = await repository.get(id);
        return new UserEditor(row.id, row.name, row.credentials, row.created_at);
    }
}
export default UserFactory;
