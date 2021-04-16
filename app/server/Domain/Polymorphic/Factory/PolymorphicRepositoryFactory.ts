import PolymorphicRepository from '../Repository/PolymorphicRepository';

class PolymorphicRepositoryFactory {
    static create() {
        return new PolymorphicRepository();
    }
}
export default PolymorphicRepositoryFactory;
