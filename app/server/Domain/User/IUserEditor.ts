interface IUserEditor {
    edit(): Promise<boolean>;
    delete(): Promise<boolean>;
}