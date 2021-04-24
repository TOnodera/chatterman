import IUser from "../../../Domain/User/Interface/IUser";
import Datetime from "../../../Utility/Datetime";

interface IMessageEditor {

    message_id: string;
    message: string;
    user: IUser;
    room_id: string;
    options?: Options;
    created_at: Datetime;

    edit(message: string): Promise<boolean>;
    isEditable(message: IMessageEditor): Promise<boolean>;
    delete(): Promise<boolean>

}

export default IMessageEditor;