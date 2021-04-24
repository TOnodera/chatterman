import { ROOM_TYPE } from "../../Enum/Enum";
import { transaction } from "../../Utility/Connection/Connection";
import IRoom from "../Room/Interface/IRoom";
import IRoomRegister from "../Room/Interface/IRoomRegister";
import Room from '../Room/Room';
import RoomRegister from "../Room/RoomRegister";

class UserManager {

    private room: IRoom;

    constructor() {
        this.room = new Room();
    }

    async registe(userRegister: IUserRegister): Promise<string> {

        const [id]: string[] = await transaction(async () => {

            const user_id = await userRegister.registe();
            const register: IRoomRegister = new RoomRegister(user_id, user_id, ROOM_TYPE.directmessage);//デフォルトのユーザールームとお知らせ用のDMルームも合わせて作成

            if (user_id && await this.room.createUserDefaultRoom(register) && this.room.createInformationRoom(user_id)) {
                return [user_id];
            }
            return [];

        });

        return id;
    }


}
export default new UserManager;