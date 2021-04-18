import ILoginManager from './Interface/ILoginManager';
import IUserRepository from './Repository/IUserRepository';
import UserRepositoryFactory from './Factory/UserRepositoryFactory';
import AuthenticationException from '../../Exception/AuthenticationException';
import { Socket } from 'socket.io';
import logger from '../../Utility/logger';
import AfterLoginManager from './AfterLoginManager';

class LoginManager implements ILoginManager {
    repository: IUserRepository;

    constructor() {
        this.repository = UserRepositoryFactory.create();
    }

    async login(credentials: Credentials): Promise<boolean> {
        logger.info(`LoginManager.login() -> 1/2 ログイン処理開始:${credentials.email}`);
        if (await this.repository.credentials(credentials)) {
            logger.info(`LoginManager.login() -> 2/2 ログイン処理完了:${credentials.email}`);
            return true;
        }
        throw new AuthenticationException('認証情報が間違っています。未登録の場合は登録して下さい。');
    }

    getAfterLoginManager(socket: Socket) {
        return new AfterLoginManager(socket);
    }
}

const loginManager = new LoginManager();
export { loginManager, LoginManager };
