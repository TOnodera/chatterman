import { mySqlConnector } from '../../Domain/Utility/Connection/Connection';
import UserEditor from '../../Domain/User/UserEditor';
import LoginUsersStore from '../../Store/LoginUsersStore';

describe('LoginStore', () => {
    const credentials: Credentials = {
        email: 'test@test.com',
        password: 'password'
    };
    const user: UserEditor = new User('tester', credentials);
    beforeAll(() => {
        user.registe();
    });
    afterAll(() => {
        mySqlConnector.query('TRUNCATE TABLE users');
    });

    it('deleteできる', () => {
        expect(LoginUsersStore.delete(user.id!)).toBe(true);
    });

    it('削除済みならfalse', () => {
        expect(LoginUsersStore.delete(user.id!)).toBe(false);
    });
});
