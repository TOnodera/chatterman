import Exception from '../../../Exception/Exception';
import Datetime from '../../../Utility/Datetime';
import RoomEditor from '../RoomEditor';
import roomRepositoryFactory from './RoomRepositoryFactory';

class RoomFactory {
    static async create(id: string): Promise<RoomEditor> {
        const repository = await roomRepositoryFactory.create();
        const room: any = await repository.getRoom(id);
        if (room) {
            return new RoomEditor(id, room.name, room.creater_id, room.room_type, new Datetime(room.created_at));
        }
        throw new Exception('ファクトリでルームの生成に失敗しました。');
    }
}

export default RoomFactory;
