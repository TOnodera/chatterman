import User from '../Domain/User/User';
import { mySqlConnector } from '../Domain/Utility/Connection';
import UserRepositoryFactory from '../Domain/User/UserRepositoryFactory';
import IUserRepository from '../Domain/User/IUserRepository';
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

describe('User', () => {

    describe('Userクラス', () => {

        let user: User;
        let email: string;
        let repository: IUserRepository;

        beforeEach(async () => {
            email = 'test@test.com';
            user = new User('test', { email: email, password: 'password' });
            repository = UserRepositoryFactory.create();
        });

        afterEach(async ()=>{
            await mySqlConnector.query('TRUNCATE TABLE users');
        });

        describe('registe()', () => {
            it('registe(user)で新規登録出来る', async () => {
                await user.registe();
                const expectTrue = await repository.thisEmailIsAlreadyUsed(email);
                expect(expectTrue).toBe(true);
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