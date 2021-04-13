import ApplyPolymorphicRepository from '../Repository/ApplyPolymorphicRepository';

class ApplyPolymorphicRepositoryFactory{
    static create(){
        return new ApplyPolymorphicRepository();
    }
}
export default ApplyPolymorphicRepositoryFactory;