import Datetime from "../../../Utility/Datetime";
import IUserRepository from "../Repository/IUserRepository";

interface IUserEditor {
    id: string;
    credentials: Credentials;
    name: string;
    created_at: Datetime;
    repository: IUserRepository;
}

export default IUserEditor;