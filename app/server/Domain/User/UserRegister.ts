import uuid = require('node-uuid');
import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import Bcrypt from '../../Utility/Bcrypt';
import DomainException from '../../Exception/DomainException';
import Exception from '../../Exception/Exception';
import IUserRepository from './Repository/IUserRepository';
import IUserRegister from './Interface/IUserRegister';
import { USER_TYPE } from '../../Enum/Enum';

class UserRegister implements IUserRegister {
    id: string;
    credentials: Credentials;
    name: string;
    type: USER_TYPE;
    repository: IUserRepository;

    constructor(name: string, credentials: Credentials) {
        this.id = uuid.v4();
        this.name = name;
        this.credentials = credentials;
        this.type = USER_TYPE.USER;
        this.repository = UserRepositoryFactory.create();
    }

    async registe(): Promise<string> {

        if (!this.credentials || !this.name) {
            throw new Exception('このインスタンスを生成したコンストラクタではこのメソッドは呼び出せません。');
        }
        if (await this.repository.thisEmailIsAlreadyUsed(this.credentials.email)) {
            throw new DomainException('このメールアドレスは使用されています。');
        }
        if (await this.repository.thisNameIsAlreadyUsed(this.name)) {
            throw new DomainException('このユーザー名は使用されています。');
        }

        this.credentials.password = await Bcrypt.hash(this.credentials.password);
        await this.repository.registe(this);

        return this.id;
    }
}

export default UserRegister;
