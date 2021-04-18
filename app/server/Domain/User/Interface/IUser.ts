interface IUser {
    registe(userRegister: IUserRegister): Promise<boolean>;
}