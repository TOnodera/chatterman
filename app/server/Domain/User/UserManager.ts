import { transaction } from '../Utility/Connection/Connection';
import userService from './Service';
import UserRegister from './UserRegister';
import roomManager from '../Room/RoomManager';
import logger from '../Utility/logger';
import { ROOM_TYPE } from '../../Enum/Enum';

class UserManager{

    async registe(fromClient: UserRegisteInfo): Promise<boolean> {

        logger.info(`1/2 UserController.registe() -> 登録処理開始 name: ${fromClient.name}`);

        const user: UserRegister = new UserRegister(fromClient.name, fromClient.credentials);
        const [result]: boolean[] = await transaction(async () => {

            const user_id = await user.registe();
            if (user_id && await roomManager.createUserDefaultRoom(user_id, ROOM_TYPE.directmessage) && roomManager.createInformationRoom(user_id)) { //デフォルトのユーザールームとお知らせ用のDMルームも合わせて作成
                return true;
            }
            return false;
            
        });

        logger.info(`2/2 UserController.registe() -> 登録処理完了 name: ${fromClient.name}`);

        return result;
    }

    async getUserById(user_id: string){
        return await userService.getUserById(user_id);
    }    
}

export default new UserManager;