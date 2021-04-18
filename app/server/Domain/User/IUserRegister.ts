interface IUserRegister {
    registe(fromClient: UserRegisteInfo): Promise<string>;
}