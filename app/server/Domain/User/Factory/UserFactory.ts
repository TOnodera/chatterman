import User from "../User";
import repositoryFactory from './UserRepositoryFactory';
class UserFactory{
    static async create(id: string): Promise<User>{
        const repository = await repositoryFactory.create();
        const row : any = await repository.get(id);
        return new User(row.id,row.name,row.credentials,row.created_at);        
    }
}
export default UserFactory;