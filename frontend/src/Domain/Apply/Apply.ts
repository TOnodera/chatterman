import swal from '../../util/swal';
import socketStore from '../Socket';

class Apply {
    apply(target_user: string,basicInfo: UserBasicInfo){
        if(!target_user || !basicInfo.credentials.email || !basicInfo.credentials.password){
            swal.error('不正なリクエストが行われました。');
            return;
        }
        socketStore.socket.emit('user:apply-directmessage',target_user,basicInfo);
    }
    hasRequest() {

    }
    alreadyRequests(){

    }
    async showApplyForm(target_user: string,basicInfo: UserBasicInfo) {

        /*
        //リクエストが無いか確認
        if(this.hasRequest()){
            //ある場合は承認画面を表示
            showApproveFrom();
            return;
        }
        
        //申請済みか確認
        if(this.alreadyRequests()){
            swal.info('申請済みです。承認されるまでお待ち下さい。');
        }
        */

        //未申請の場合は申請
        if(await this.applyForm()){
            this.apply(target_user,basicInfo);
        }
    }

    async applyForm(): Promise<boolean>{
        return await swal.fire({
            title: 'ユーザーの許可が必要です。',
            text: 'ダイレクトメッセージを送る場合は許可が必要です。',
            showDenyButton: true,
            confirmButtonText: `許可申請する`,
            denyButtonText: `申請しない`,
        }).then(result =>{
             if(result.isConfirmed){
                 return true;
             }
             return false;
        });
    }

    alreadyAcceptedListener(){
        socketStore.registeOnce('user:already-application-is-accepted',(msg:string)=>{
            swal.info(msg);
        });
    }

    hasAcceptedListener(){
        socketStore.registeOnce('user:already-requested',(msg: string)=>{
            swal.info(msg);
        });
    }

    requestHasSentListener(){
        socketStore.registeOnce('user:apply-resuest-has-sent',(msg: string)=>{
            swal.info(msg);
        });
    }

    launchListener(){
        this.alreadyAcceptedListener();
        this.hasAcceptedListener();
        this.requestHasSentListener();
    }

}
export default new Apply;