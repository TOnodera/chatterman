import UserRepositoryFactory from './UserRepositoryFactory';
class Service{
    private repository: any;
    constructor(){
        this.repository = UserRepositoryFactory.create();
    }
    async getUsers(): Promise<Client[]>{
        return await this.repository.getUsers();
    }
}
export default new Service();