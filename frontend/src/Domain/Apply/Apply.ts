import swal from '../../util/swal'
import socketStore from '../Socket'

class Apply {
  apply (target_user: string, basicInfo: UserBasicInfo) {
    if (!target_user || !basicInfo.credentials.email || !basicInfo.credentials.password) {
      swal.error('不正なリクエストが行われました。')
      return
    }
    socketStore.socket.emit('user:apply-directmessage', target_user, basicInfo)
  }

  async showApplyForm (target_user: string, basicInfo: UserBasicInfo) {
    /**
         * 申請処理
         * 受付・申請済・受信中などの処理はサーバー側で判断してメッセージ通知
         * イベントハンドラでそれぞれの処理を実装する
         */
    if (await this.applyForm()) {
      this.apply(target_user, basicInfo)
    }
  }

  async applyForm (): Promise<boolean> {
    return await swal.fire({
      title: 'ユーザーの許可が必要です。',
      text: 'ダイレクトメッセージを送る場合は許可が必要です。',
      showDenyButton: true,
      confirmButtonText: '許可申請する',
      denyButtonText: '申請しない'
    }).then(result => {
      if (result.isConfirmed) {
        return true
      }
      return false
    })
  }

  alreadyAcceptedListener () {
    socketStore.registeOnce('user:already-application-is-accepted', (msg:string) => {
      swal.info(msg)
    })
  }

  hasAcceptedListener () {
    socketStore.registeOnce('user:already-requested', (msg: string) => {
      swal.info(msg)
    })
  }

  requestHasSentListener () {
    socketStore.registeOnce('user:apply-resuest-has-sent', (msg: string) => {
      swal.info(msg)
    })
  }

  launchListener () {
    this.alreadyAcceptedListener()
    this.hasAcceptedListener()
    this.requestHasSentListener()
  }
}
export default new Apply()
