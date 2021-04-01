import uuid from 'node-uuid';
import DomainException from '../Exception/DomainException';
import Exception from '../Exception/Exception';
import repository from './RoomRepository';
class Room{

    id?: string;
    name?: string;
    creater_id?: string;
    created_at?: string;
    private repository;

    constructor(id?: string){
        this.repository = repository;
        this.id = id;
    }

    async create(name: string,creater_id: string): Promise<boolean>{
        if(!name || !creater_id){
            throw new Exception('name,creater_idがない状態で呼び出せません。');
        }
        if(await this.repository.existsSameName(name)){
            throw new DomainException('同じ名前のルームが登録されているので名前を変えて下さい。');
        }
        this.id = uuid.v4();
        this.name = name;
        this.creater_id = creater_id;
        return await this.repository.createRoom(this);
    }

}

export default Room;