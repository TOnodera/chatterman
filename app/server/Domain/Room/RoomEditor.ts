import { ROOM_TYPE } from "../../Enum/Enum";
import Datetime from "../../Utility/Datetime";
import UserFactory from "../User/Factory/UserFactory";
import IUserEditor from "../User/Interface/IUserEditor";
import IRoomEditor from "./Interface/IRoomEditor";

class RoomEditor implements IRoomEditor {
    id: string;
    name: string;
    creater_id: string;
    room_type: ROOM_TYPE;
    created_at: Datetime;

    constructor(id: string, name: string, creater_id: string, room_type: ROOM_TYPE, created_at: Datetime) {
        this.id = id;
        this.name = name;
        this.creater_id = creater_id;
        this.room_type = room_type;
        this.created_at = created_at;
    }
}

export default RoomEditor;