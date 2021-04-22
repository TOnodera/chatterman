import IUserEditor from "../../../Domain/User/Interface/IUserEditor";
import Datetime from "../../../Utility/Datetime";

interface IMessageEditor {

    message_id: string;
    message: string;
    user: IUserEditor;
    room_id: string;
    options?: Options;
    created_at: Datetime;

    edit(message: string): Promise<boolean>;
    isEditable(message: IMessageEditor): Promise<boolean>;
    delete(): Promise<boolean>

}

export default IMessageEditor;