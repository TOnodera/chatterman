class LogoutObserver{
    static handler: Function;
    static update(id: string){
        if(this.handler){
            this.handler(id);
            return;
        }
        throw new Error('イベントハンドラがない状態で呼び出されました。');
    }
}
export default LogoutObserver;