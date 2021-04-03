import UserRepositoryFactory from './UserRepositoryFactory';
import loginUsersStore from '../../Store/LoginUsersStore';
class Service{
    private repository: any;
    constructor(){
        this.repository = UserRepositoryFactory.create();
    }
    async getUsers(): Promise<Client[]>{
        const users: Client[] = await this.repository.getUsers();
        for(let user of users){
            if(loginUsersStore.inUsers(user.id)){
                user.isLogin = true;
            }else{
                user.isLogin = false;
            }
        }
        return users;
    }
}
export default new Service();