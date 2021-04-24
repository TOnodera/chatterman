import Datetime from "../../../Utility/Datetime";
import IUserRepository from "../Repository/IUserRepository";

interface IUser {
    id: string;
    credentials: Credentials;
    name: string;
    created_at: Datetime;
    repository: IUserRepository;
}

export default IUser;