import User from '../../Domain/User/User';
import { mySqlConnector } from '../../Domain/Utility/Connection/Connection';
import IUserRepository from '../../Domain/User/Repository/IUserRepository';
import UserRepositoryFactory from '../../Domain/User/Factory/UserRepositoryFactory';
import AuthenticationException from '../../Domain/Exception/AuthenticationException';
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

describe('UserRepository', () => {

    let user: User;
    let name: string;
    let email: string;
    let password: string;
    let repository: IUserRepository;
    let origin: any;

    beforeEach(async () => {
        email = 'test@test.com';
        name = 'tester';
        password = 'password';
        user = new User(name, { email: email, password: password });
        repository = UserRepositoryFactory.create();
        await user.registe();
        origin = mySqlConnector.query;
    });

    afterEach(async ()=>{
        mySqlConnector.query = origin;
        jest.clearAllMocks();
        await mySqlConnector.query('TRUNCATE TABLE users');
    });

    describe('registe()', () => {

        it('新規登録出来る', async () => {
            const expectTrue = await repository.thisEmailIsAlreadyUsed(email);
            expect(expectTrue).toBe(true);
        });

    });

    describe('thisEmailIsAlreadyUsed()', () => {

        it('既に登録されているメールアドレスを判別できる', async () => {
            const expectTrue = await repository.thisEmailIsAlreadyUsed(email);
            expect(expectTrue).toBe(true);
        });

        it('録されていないメールアドレスの場合はfalse', async () => {
            const expectFalse = await repository.thisEmailIsAlreadyUsed(email+'email');
            expect(expectFalse).toBe(false);
        });
 
    });

    describe('getUserByCredentials()', () => {

        it('email,passwordでユーザーインスタンスを取得出来る', async () => {
            const getUser = await repository.getUserByCredentials({email: email,password: password});
            expect(getUser && getUser.credentials!.email).toBe(email);
        });

        it('存在しない場合は例外を投げる', async () => {
            expect(async ()=> {await repository.getUserByCredentials({email: email+'email',password: password}) }).rejects.toThrow(new AuthenticationException('認証情報に一致するユーザーが見つかりませんでした。'));
        });
 
    });

    describe('credentials()', () => {

        it('email,passwordでユーザーの存在を判定できる', async () => {
            const expectTrue = await repository.credentials({email: email,password: password});
            expect(expectTrue).toBe(true);
        });

        it('存在しない場合はfalse', async () => {
            const expectFalse = await repository.credentials({email: email+'not exist',password: password});
            expect(expectFalse).toBe(false);
        });
 
    });


})