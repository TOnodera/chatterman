class Room{
    
    id?: string;
    name?: string;
    creater_id?: string;
    created_at?: string;

    constructor(id?:string,name?: string,creater_id?: string){
        if(id && !name && !creater_id){
            this.id = id;
            return;
        }
        if(!id && name && creater_id){
            this.name = name;
            this.creater_id = creater_id;
        }
    }

}