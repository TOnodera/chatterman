import socketStore from './socketStore';
export default {
    me: {} as Me,
    users: [] as User[],
    handlers: {
        registerExceptionHandler: (e: string): void => {}
    },
    isLogin(){
        return this.me.isLogin;
    },
    addUser(user: User){
        this.users.push(user);
    },
    deleteUser(id: string){
        this.users = this.users.filter(user=>{
            return user.id != id;
        });
    },
    userCount(): number{
        return this.users.length;
    },
    registe(newUser: UserRegisteInfo){
        socketStore.socket.emit('user:registe',newUser);
    },
    addRegisterExceptionHandler(func: (e: string)=>{}): void{
        this.handlers.registerExceptionHandler = func;
    },
    registerExceptionListener(){
        socketStore.socket.on('occurred:domain-exception',(msg)=>{
            this.handlers.registerExceptionHandler(msg);
        });
    }
};