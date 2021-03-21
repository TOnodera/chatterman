class Exception{
    message: string | Object;
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