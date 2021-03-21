import User from '../Domain/User/User';
import { connector } from '../Domain/Utility/Connection';
import UserRepository from '../Domain/User/UserRepository';

describe('User', () => {

    describe('Userクラス', () => {

        let user: User;
        let email: string;
        let repository: UserRepository;

        beforeEach(async () => {
            await connector.query('TRUNCATE TABLE users');
            email = 'test@test.com';
            user = new User('test', { email: email, password: 'password' });
            repository = new UserRepository();
        });

        describe('registe()', () => {
            it('registe(user)で新規登録出来る', async () => {
                await user.registe();
                const getUser = await repository.getUserByEmail(email);
                expect(getUser && getUser.credentials.email).toBe(email);
            });
        });

        describe('isAccessable()', () => {
            it('引数を渡すとtrueを返す', () => {
                const exp: boolean = user.isAccessable('everybody');
                expect(exp).toBe(true);
            });
        });
    });

})