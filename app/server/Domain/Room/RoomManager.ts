import User from '../User/User';
import Room from './Room';
import repository from './RoomRepository';
class RoomManager{

    private repository: any;
    constructor(){
        this.repository = repository;
    }

    async attemptToEnter(info: RoomAndUserId): Promise<boolean>{
        const user: User = new User(info.user_id);
        if(await user.load() && await user.isAccessable(info.room_id)){
            return true;
        }
        return false;
    }

    async leaveCurrentRoom(info: RoomAndUserId): Promise<boolean>{
        const user: User = new User(info.user_id);
        if(await user.load() && await user.isAccessable(info.room_id)){
            return true;
        }
        return false;
    }

    async createRoom(name: string,user_id: string): Promise<boolean>{
        const room: Room = new Room();
        return await room.create(name,user_id);
    }

    async createUserDefaultRoom(user_id: string): Promise<boolean>{
        let result: boolean;
        try{
            this.repository.begin();
            result = await this.createRoom(user_id,user_id) && await this.addAccessableRooms(user_id,user_id);
            this.repository.commit();
        }catch{
            this.repository.rollback();
            result = false;
        }
        return result;
    }

    async addAccessableRooms(user_id: string,room_id: string): Promise<boolean>{
        return await this.repository.addAccessableRooms(user_id,room_id);
    }
    
}
export default new RoomManager();