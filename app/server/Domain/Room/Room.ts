import uuid from 'node-uuid';
import DomainException from '../Exception/DomainException';
import Exception from '../Exception/Exception';
import repository from './RoomRepository';
class Room {

    id?: string;
    name?: string;
    creater_id?: string;
    created_at?: string;
    private repository;

    constructor(id?: string) {
        this.repository = repository;
        this.id = id;
    }

    async getRoom(id: string): Promise<Room> {

        const room: any = await this.repository.getRoom(id);

        console.log(room);

        const response = new Room(room.id);
        response.name = room.name;
        response.creater_id = room.creater_id;
        response.created_at = room.created_at;

        return room;
    }

    async create(name: string, creater_id: string): Promise<Room> {

        if (!name || !creater_id) {
            throw new Exception('name,creater_idがない状態で呼び出せません。');
        }

        if (await this.repository.existsSameName(name)) {
            throw new DomainException('同じ名前のルームが登録されているので名前を変えて下さい。');
        }

        try{

        this.id = uuid.v4();
        this.name = name;
        this.creater_id = creater_id;
        await this.repository.createRoom(this);
        console.log(await this.getRoom(this.id));
        }catch(e){
            console.log(e);
        }

        return await this.getRoom(this.id as string);
        
    }

}

export default Room;