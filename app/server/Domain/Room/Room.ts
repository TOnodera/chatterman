import { ROOM_TYPE } from '../../Enum/Enum';
import Datetime from '../Utility/Datetime';
class Room {

    id: string;
    name: string;
    creater_id: string;
    room_type: ROOM_TYPE;
    created_at: Datetime;

    constructor(id: string,name: string,creater_id: string,room_type: ROOM_TYPE,created_at: Datetime) {
        this.id = id;
        this.name = name;
        this.creater_id = creater_id;
        this.room_type = room_type;
        this.created_at = created_at;
    }
}

export default Room;