interface IUser {
    registe(fromClient: UserRegisteInfo, userRegister: IUserRegister): Promise<string>;
}