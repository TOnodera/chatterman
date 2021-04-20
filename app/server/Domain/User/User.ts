import { ROOM_TYPE } from "../../Enum/Enum";
import { transaction } from "../../Utility/Connection/Connection";
import roomManager from '../Room/RoomManager';

class User implements IUser {

    async registe(userRegister: IUserRegister): Promise<string> {

        const [id]: string[] = await transaction(async () => {

            const user_id = await userRegister.registe();
            if (user_id && await roomManager.createUserDefaultRoom(user_id, ROOM_TYPE.directmessage) && roomManager.createInformationRoom(user_id)) { //デフォルトのユーザールームとお知らせ用のDMルームも合わせて作成
                return [user_id];
            }
            return [];

        });

        return id;
    }


}
export default new User;