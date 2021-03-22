class Exception extends Error{
    status: number;
    constructor(message?: string | undefined,status: number = 500){
        super(message);
        this.status = status;
    }
}
export default Exception;