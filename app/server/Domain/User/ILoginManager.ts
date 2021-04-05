import { Socket } from "socket.io";
import User from "./User";
interface ILoginManager{
    login(credentials: Credentials,socket: Socket): Promise<User>;
    logout(credentials: Credentials,socket: Socket): Promise<boolean>;
    authenticate(credentials: Credentials): Promise<boolean>;
}
export default ILoginManager;