import Exception from './Exception';
class DomainException extends Exception {
    constructor(message?: string | undefined, status: number = 422) {
        super(message, status);
    }
    get(): Exception {
        return this;
    }
}
export default DomainException;
