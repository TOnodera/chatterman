import swal from './swal';

class HttpError{

    hasHttpError(data:{message: string,status: number}){
        if(!data.status){
            return false;
        }
        const regExp: RegExp = new RegExp(/^(4|5)\d{2,2}$/);
        if(regExp.test(data.status.toString())){
            return true;
        }
        return false;
    }

    showError(data:{message: string,status: number}){
        swal.fire(data.message);
    }

}

export default new HttpError;