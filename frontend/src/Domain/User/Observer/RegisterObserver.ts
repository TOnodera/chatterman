class RegisterObserver {
    static handler: Function;
    static update(msg: string) {
        if (this.handler) {
            this.handler(msg);
            return;
        }
        throw new Error('イベントハンドラが設定されていない状態で呼び出されました。');
    }
}
export default RegisterObserver;