class LoginManager implements ILoginManager{
    iUserRepository: IUserRepository;
    constructor(){
        this.iUserRepository = UserRepositoryFactory.create();
    }
    login(credentials: Credentials): boolean {
        throw new Error("Method not implemented.");
    }
    logout(credentials: Credentials): boolean {
        throw new Error("Method not implemented.");
    }
    authenticate(credentials: Credentials): boolean {
        throw new Error("Method not implemented.");
    }
    
}