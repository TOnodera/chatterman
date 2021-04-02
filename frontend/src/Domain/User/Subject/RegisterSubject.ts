import RegisterObserver from "../Observer/RegisterObserver";
class RegisterSubject{
    notify(msg: string){
        RegisterObserver.update(msg);
    }
}
export default new RegisterSubject();