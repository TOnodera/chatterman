class AnotherUserLoginObserver{
    static handler: Function;
    static update(id: string){
        if(this.handler){
            this.handler(id);
            return;
        }
        throw new Error('イベントハンドラが登録されていない状態で呼び出されました。');
    }
}
export default AnotherUserLoginObserver;