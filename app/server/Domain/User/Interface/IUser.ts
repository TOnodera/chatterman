interface IUser {
    registe(userRegister: IUserRegister): Promise<string>;
}