import Exception from './Exception';
class AuthenticationException extends Exception{
    constructor(message?: string | undefined,status: number = 401){
        super(message,status);
    }
    get(): Exception{
        return this;
    }
}
export default AuthenticationException;