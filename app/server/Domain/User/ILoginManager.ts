interface ILoginManager{
    iUserRepository: IUserRepository;
    login(credentials: Credentials): boolean;
    logout(credentials: Credentials): boolean;
    authenticate(credentials: Credentials): boolean;
}