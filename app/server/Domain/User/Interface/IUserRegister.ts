import { USER_TYPE } from "server/Enum/Enum";
import IUserRepository from "../Repository/IUserRepository";

interface IUserRegister {
    id: string;
    credentials: Credentials;
    name: string;
    type: USER_TYPE;
    repository: IUserRepository;
    registe(): Promise<string>;
}

export default IUserRegister;