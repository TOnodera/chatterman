import swal from './swal'

class HttpError {
  hasHttpError (data:{message: string, status: number}) {
    if (!data.status) {
      return false
    }
    const regExp = new RegExp(/^(4|5)\d{2,2}$/)
    if (regExp.test(data.status.toString())) {
      return true
    }
    return false
  }

  showError (data:{message: string, status: number}) {
    swal.warning(data.message)
  }
}

export default new HttpError()
