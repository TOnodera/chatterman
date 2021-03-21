class Exception{
    message: string;
    status: number;
    constructor(message: string,status: number){
        this.message = message;
        this.status = status;
    }
    get(): Exception{
        return this;
    }
}
export default Exception;