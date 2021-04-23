import RoomRepository from '../Repository/RoomRepository';

class RoomRepositoryFactory {
    static create() {
        return new RoomRepository();
    }
}
export default RoomRepositoryFactory;
