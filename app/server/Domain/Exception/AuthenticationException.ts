import Exception from './Exception';
class AuthenticationException extends Exception{
    constructor(message: string,status: number){
        super(message,status);
    }
    get(): Exception{
        return this;
    }
}
export default AuthenticationException;