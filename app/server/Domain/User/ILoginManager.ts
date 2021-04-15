import { Socket } from "socket.io";
interface ILoginManager {
    login(credentials: Credentials): Promise<boolean>;
}
export default ILoginManager;