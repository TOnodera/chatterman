import DomainException from "server/Domain/Exception/DomainException";
import User from "../Domain/User/User";
export default {
    users: [] as unknown as User[],
    maxUserNum: 100,
    enqueue(user: User){
        if(user.id && this.users.length < this.maxUserNum){
            if(!this.inUsers(user.id)){
                this.users.push(user);
            }
            return true;
        }
        throw new DomainException('ログインユーザー数が上限を超えました。しばらくしてから再ログインしてください。');
    },
    dequeue(){
        return this.users.shift();
    },
    delete(id: string){
        if(this.inUsers(id)){
            this.users = this.users.filter((user)=>{
                return user.id != id;
            });
            return true;
        }
        return false;
    },
    inUsers(id: string){
        const user =this.users.filter((user: any)=>{
            return user.id == id;
        });
        return user.length > 0;
    }
}