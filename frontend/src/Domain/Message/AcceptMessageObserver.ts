class AcceptMessageObserver {
    static handler: Function;
    static update(messages: any[]) {
        if (this.handler) {
            this.handler(messages);
            return;
        }
        throw new Error("ハンドラが設定されていない状態で呼び出されました。");
    }
}
export default AcceptMessageObserver;