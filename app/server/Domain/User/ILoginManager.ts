import User from "./User";
interface ILoginManager{
    login(credentials: Credentials): Promise<User>;
    logout(credentials: Credentials): Promise<boolean>;
    authenticate(credentials: Credentials): Promise<boolean>;
}
export default ILoginManager;