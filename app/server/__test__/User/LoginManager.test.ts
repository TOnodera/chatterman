import { mySqlConnector } from '../../Domain/Utility/Connection/Connection';
import LoginManager from '../../Domain/User/LoginManager';
import UserEditor from '../../Domain/User/UserEditor';

describe('LoginManager', () => {
    const credentials: Credentials = {
        email: 'test@test.com',
        password: 'password'
    };
    const loginManager: LoginManager = new LoginManager();
    const user: UserEditor = new User('tester', credentials);

    describe('Login()', () => {
        it('ログイン出来る', async () => {
            await user.registe();
            const result = await loginManager.login(user.credentials!);
            expect(result).toBe(true);
            mySqlConnector.query('TRUNCATE TABLE users');
        });
    });
});
