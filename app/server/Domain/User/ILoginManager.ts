import IUserRepository from "./IUserRepository";
import User from "./User";
interface ILoginManager{
    login(credentials: Credentials): Promise<{user?: User,success: boolean}>;
    logout(credentials: Credentials): Promise<boolean>;
    authenticate(credentials: Credentials): Promise<boolean>;
}
export default ILoginManager;