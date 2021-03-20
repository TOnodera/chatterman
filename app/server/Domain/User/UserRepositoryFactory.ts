class UserRepositoryFactory{
    static create(): IUserRepository{
        throw new Exception('Not implements...',500);
    }
}