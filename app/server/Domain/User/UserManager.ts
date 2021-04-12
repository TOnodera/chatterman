import userService from './Service';
class UserManager{
    async getUserById(user_id: string){
        return await userService.getUserById(user_id);
    }    
}

export default new UserManager;