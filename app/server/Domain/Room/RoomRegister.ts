import uuid from 'node-uuid';
import RoomRepositoryFactory from './Factory/RoomRepositoryFactory';
import RoomRepository from './Repository/RoomRepository';
class RoomRegister {

    id: string;
    name: string;
    creater_id: string;
    room_type: RoomType;
    private repository: RoomRepository;

    constructor(name: string,creater_id: string,room_type:RoomType) {
        this.repository = RoomRepositoryFactory.create();
        this.id = uuid.v4();
        this.name = name;
        this.creater_id = creater_id;
        this.room_type = room_type;
    }

    async create(): Promise<string> {
        await this.repository.createRoom(this);
        return this.id;
    }

}

export default RoomRegister;