import Exception from "../Domain/Exception/Exception";
import DomainException from "../Domain/Exception/DomainException";
import User from "../Domain/User/User";
import logger from "../Domain/Utility/logger";
export default {
    //users: [] as unknown as User[],
    users: new Map as Map<string,User>,
    maxUserNum: 100,
    set(socket_id:string,user: User){
        if(!user.id){
            throw new  Exception('idの無いユーザーをストアに追加しようとしました。');
        }
        logger.info(this.users.size);
        if(this.users.size < this.maxUserNum){
            if(!this.users.has(socket_id)){
                this.users.set(socket_id,user);
            }
            return true;
        }else{
            throw new DomainException('ログインユーザー数が上限を超えました。しばらくしてから再ログインしてください。');
        }
    },
    delete(socket_id: string){
        if(this.users.has(socket_id)){
            return this.users.delete(socket_id);
        }
        return false;
    },
    inUsers(user_id: string){
        let exists: boolean = false;
        this.users.forEach(user=>{
            if(user.id == user_id){
                exists = true;
            }
        });
        return exists;
    },
    getUserInUsersMap(socket_id:string): {user?:User,exist:boolean}{
        if(this.users.has(socket_id)){
            return {user:this.users.get(socket_id),exist: true};
        }
        return {exist: false};
    },
    getSocketNumPerUser(user_id: string): number{
        let count = 0;
        this.users.forEach((user)=>{
            if(user.id == user_id){
                count++;
            }
        });
        return count;
    },
    getSocketNumUsingThisUser(socket_id: string): number{
        const {user,exist} = this.getUserInUsersMap(socket_id);
        if(exist){
            return this.getSocketNumPerUser(user!.id);
        }
        return 0;
    },
    getSocketsByUserId(user_id: string): string[]{
        let sockets: string[] = [];
        this.users.forEach((user,socketId)=>{
            if(user_id == user.id){
                sockets.push(socketId);
            }
        });
        return sockets;
    }
}