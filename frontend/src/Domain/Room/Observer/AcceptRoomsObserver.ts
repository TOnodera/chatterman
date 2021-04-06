class AcceptRoomsObserver{
    static handler: Function;
    static update(rooms: any[]){
        if(this.handler){
            this.handler(rooms);
        }
        throw new Error("イベントハンドラがない状態で呼び出されました。");
    }
}
export default AcceptRoomsObserver;