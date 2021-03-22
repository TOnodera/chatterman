import User from "../Domain/User/User";
export default {
    users: [] as unknown as User[],
    enqueue(user: User){
        this.users.push(user);
    },
    dequeue(){
        return this.users.shift();
    }
}