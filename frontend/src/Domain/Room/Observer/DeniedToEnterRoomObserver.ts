class DeniedToEnterRoomObserver{
    static handler: Function;
    static update(msg: string){
        if(this.handler){
            this.handler(msg);
            return;
        }
        throw new Error("イベントハンドラがない状態で呼び出されました。");
    }
}
export default DeniedToEnterRoomObserver;