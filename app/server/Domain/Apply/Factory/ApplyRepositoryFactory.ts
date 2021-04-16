import ApplyRepository from '../Repository/ApplyRepository';

class ApplyRepositoryFactory {
    static create() {
        return new ApplyRepository();
    }
}
export default ApplyRepositoryFactory;
