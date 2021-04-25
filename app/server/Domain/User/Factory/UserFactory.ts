import { USER_TYPE } from '../../../Enum/Enum';
import Exception from '../../../Exception/Exception';
import IUser from '../Interface/IUser';
import User from '../User';
import repositoryFactory from './UserRepositoryFactory';
class UserFactory {
    static async create(id: string): Promise<IUser> {
        const repository = await repositoryFactory.create();
        const row: any = await repository.get(id);

        switch (row.type) {
            case USER_TYPE.USER:
                return new User(row.id, row.name, row.credentials, USER_TYPE.USER, row.created_at);
            case USER_TYPE.SYSTEM:
                return new User(row.id, row.name, row.credentials, USER_TYPE.SYSTEM, row.created_at);
        }
        throw new Exception('到達不能なコード');
    }
}
export default UserFactory;
