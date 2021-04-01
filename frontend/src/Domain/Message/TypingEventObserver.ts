class TypingEventObserver{
    static handle: Function;
    static update(user: User){
        if(this.handle){
            this.handle(user);
            return;
        }
        throw new Error("イベントハンドラが設定されていない状態で呼び出されました。");
    }
}
export default TypingEventObserver;