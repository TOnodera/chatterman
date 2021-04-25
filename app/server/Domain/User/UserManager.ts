import { ROOM_TYPE } from "../../Enum/Enum";
import { transaction } from "../../Utility/Connection/Connection";
import IRoom from "../Room/Interface/IRoom";
import IRoomRegister from "../Room/Interface/IRoomRegister";
import Room from '../Room/Room';
import RoomRegister from "../Room/RoomRegister";
import UserFactory from "./Factory/UserFactory";
import IUser from "./Interface/IUser";
import IUserRegister from "./Interface/IUserRegister";
import User from "./User";

class UserManager {

    async registe(userRegister: IUserRegister): Promise<string> {

        const [id]: string[] = await transaction(async () => {

            const user_id = await userRegister.registe();
            const user: IUser = await UserFactory.create(user_id);

            if (user_id && await user.room().createUserDefaultRoom() && await user.room().createInformationRoom()) {
                return [user_id];
            }
            return [];

        });

        return id;
    }


}
export default new UserManager;