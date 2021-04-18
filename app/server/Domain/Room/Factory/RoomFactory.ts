import Exception from '../../../Exception/Exception';
import Datetime from '../../../Utility/Datetime';
import Room from '../Room';
import roomRepositoryFactory from './RoomRepositoryFactory';

class RoomFactory {
    static async create(id: string): Promise<Room> {
        const repository = await roomRepositoryFactory.create();
        const room: any = await repository.getRoom(id);
        if (room) {
            return new Room(room.id, room.name, room.creater_id, room.room_type, new Datetime(room.created_at));
        }
        throw new Exception('ルームの取得に失敗しました。');
    }
}

export default RoomFactory;
