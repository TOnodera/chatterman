
class User{
    private id?: string;
    private credentials: Credentials;
    private name: string;
    private created_at?: Datetime;
    private accessAbleRooms: Array<string>;

    constructor(user: User){
        this.credentials = user.credentials;
        this.name = user.name;
        this.accessAbleRooms = [];
    }
}