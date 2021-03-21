import Exception from './Exception';
class DomainException extends Exception{
    constructor(message: string,status: number){
        super(message,status);
    }
    get(): Exception{
        return this;
    }
}
export default DomainException;