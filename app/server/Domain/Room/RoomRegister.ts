import uuid from 'node-uuid';
import { RoomType } from 'server/@types/types';
import DomainException from '../Exception/DomainException';
import repository from './RoomRepository';
class RoomRegister {

    id: string;
    name: string;
    creater_id: string;
    room_type: RoomType;
    private repository;

    constructor(name: string,creater_id: string,room_type:RoomType) {
        this.repository = repository;
        this.id = uuid.v4();
        this.name = name;
        this.creater_id = creater_id;
        this.room_type = room_type;
    }

    async create(): Promise<string> {
        if (await this.repository.existsSameName(this.name)) {
            throw new DomainException('同じ名前のルームが登録されているので名前を変えて下さい。');
        }
        await this.repository.createRoom(this);
        return this.id;
    }

}

export default RoomRegister;