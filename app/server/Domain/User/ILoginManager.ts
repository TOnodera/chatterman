import { Socket } from "socket.io";
import User from "./User";
interface ILoginManager{
    login(credentials: Credentials,socket: Socket): Promise<User>;
}
export default ILoginManager;