import RoomRepository from '../Repository/RoomRepository';

class RepositoryFactory{
    static create(){
        return new RoomRepository();
    }
}
export default RepositoryFactory;