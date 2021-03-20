interface IUserRepository{
    registe(user: User): boolean
    getUserByEmail(email: string): User
    getUserByPassword(plainPassword: string): User
    getUserByName(name: string): User
}