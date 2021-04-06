class ArrowedToEnterRoomObserver{
    static handler: Function;
    static update(room_id: string){
        if(this.handler){
            this.handler(room_id);
        }
        throw new Error("イベントハンドラがない状態で呼び出されました。");
    }
}
export default ArrowedToEnterRoomObserver;