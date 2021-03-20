class ExceptionHandler{
    static handle(exception: Exception){
        switch(true){
            case exception instanceof DomainException:
                //ドメイン例外の処理
                break;
            case exception instanceof AuthenticationException:
                //認証例外の処理
                break;
            default:
                //想定外のエラー
                //記録と通知を行う
                break;
        }
    }
}