class User implements IUser {

    async registe(fromClient: UserRegisteInfo, userRegister: IUserRegister): Promise<string> {
        return await userRegister.registe(fromClient);
    }

}
export default new User;