class ExceptionHandler{
    static handle(exception: Exception){
        switch(true){
            case exception instanceof DomainException:
                //ドメイン例外の処理
                console.log('ドメインエラー...');
                break;
            case exception instanceof AuthenticationException:
                //認証例外の処理
                console.log('認証エラー');
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                console.log("例外");
                break;
        }
    }
}