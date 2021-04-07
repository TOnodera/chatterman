import Config from '../../config';
class ApplyService{
    makeMessage(name: string,apply_id: string,request_user: string){
        return `
            ${name}さんからダイレクトメッセージの許可申請が届きました。
            リンクをクリックして申請を処理して下さい。
            ${Config.system.baseUrl}/api/applys/${apply_id}/${request_user}
        `;
    }
}

export default new ApplyService;