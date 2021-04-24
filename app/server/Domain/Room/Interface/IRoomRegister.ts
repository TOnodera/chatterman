import { ROOM_TYPE } from "../../../Enum/Enum";

interface IRoomRegister {

    id: string;
    name: string;
    creater_id: string;
    room_type: ROOM_TYPE;

    create(): Promise<string>;
}

export default IRoomRegister;