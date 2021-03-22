import User from '../Domain/User/User';
import { mySqlConnector } from '../Domain/Utility/Connection';
import UserRepositoryFactory from '../Domain/User/UserRepositoryFactory';
import IUserRepository from '../Domain/User/IUserRepository';

describe('User', () => {

    describe('Userクラス', () => {

        let user: User;
        let email: string;
        let repository: IUserRepository;

        beforeEach(async () => {
            await mySqlConnector.query('TRUNCATE TABLE users');
            email = 'test@test.com';
            user = new User('test', { email: email, password: 'password' });
            repository = UserRepositoryFactory.create();
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