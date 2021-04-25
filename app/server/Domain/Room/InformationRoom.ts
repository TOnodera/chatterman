import { ROOM_TYPE } from "server/Enum/Enum";
import IUser from "../User/Interface/IUser";
import IRoomEditor from "./Interface/IRoomEditor";
import Room from "./Room";

class InformationRoom extends Room {

    constructor(user: IUser) {
        super(user);
    }

    create(name: string, type: ROOM_TYPE): Promise<IRoomEditor> {
        return super.create(name, type);
    }
}

export default InformationRoom;