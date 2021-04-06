class TypingEventObserver{
    static handle: Function;
    static update(user: User,room_id: string){
        if(this.handle){
            this.handle(user,room_id);
            return;
        }
        throw new Error("イベントハンドラが設定されていない状態で呼び出されました。");
    }
}
export default TypingEventObserver;