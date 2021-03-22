import IUserRepository from "./IUserRepository";
interface ILoginManager{
    login(credentials: Credentials): Promise<boolean>;
    logout(credentials: Credentials): Promise<boolean>;
    authenticate(credentials: Credentials): Promise<boolean>;
}
export default ILoginManager;