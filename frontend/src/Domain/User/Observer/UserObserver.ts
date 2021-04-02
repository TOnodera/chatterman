class UserObserver{
    static handler: Function;
    static update(msg: string){
        this.handler(msg);
    }
}
export default UserObserver;