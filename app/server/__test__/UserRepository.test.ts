import User from '../Domain/User/User';
import { mySqlConnector } from '../Domain/Utility/Connection';
import IUserRepository from '../Domain/User/IUserRepository';
import UserRepositoryFactory from '../Domain/User/UserRepositoryFactory';
import AuthenticationException from '../Domain/Exception/AuthenticationException';

describe('UserRepository', () => {

    let user: User;
    let name: string;
    let email: string;
    let password: string;
    let repository: IUserRepository;
    let origin: any;

    beforeEach(async () => {
        await mySqlConnector.query('TRUNCATE TABLE users');
        email = 'test@test.com';
        name = 'tester';
        password = 'password';
        user = new User(name, { email: email, password: password });
        repository = UserRepositoryFactory.create();
        origin = mySqlConnector.query;;
    });

    afterEach(()=>{
        mySqlConnector.query = origin;
        jest.clearAllMocks();
    });

    describe('registe()', () => {

        it('新規登録出来る', async () => {
            await user.registe();
            const expectTrue = await repository.thisEmailIsAlreadyUsed(email);
            expect(expectTrue).toBe(true);
        });

    });

    describe('thisEmailIsAlreadyUsed()', () => {

        it('既に登録されているメールアドレスを判別できる', async () => {
            await user.registe();
            const expectTrue = await repository.thisEmailIsAlreadyUsed(email);
            expect(expectTrue).toBe(true);
        });

        it('録されていないメールアドレスの場合はfalse', async () => {
            await user.registe();
            const expectFalse = await repository.thisEmailIsAlreadyUsed(email+'email');
            expect(expectFalse).toBe(false);
        });
 
    });

    describe('getUserByCredentials()', () => {

        it('email,passwordでユーザーインスタンスを取得出来る', async () => {
            await user.registe();
            const getUser = await repository.getUserByCredentials({email: email,password: password});
            expect(getUser && getUser.credentials.email).toBe(email);
        });

        it('存在しない場合は例外を投げる', async () => {
            await user.registe();
            expect(async ()=> {await repository.getUserByCredentials({email: email+'email',password: password}) }).rejects.toThrow(new AuthenticationException('認証情報に一致するユーザーが見つかりませんでした。'));
        });
 
    });


})