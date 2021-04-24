import { ROOM_TYPE } from "../../../Enum/Enum";
import Datetime from "../../../Utility/Datetime";

interface IRoomEditor {

    id: string;
    name: string;
    creater_id: string;
    room_type: ROOM_TYPE;
    created_at: Datetime;

}

export default IRoomEditor;