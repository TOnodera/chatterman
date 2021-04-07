import sweetalert2, { SweetAlertArrayOptions, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/**
 * 基本的な装飾だけはデフォルトで出せるようにここでカスタム
 */
class CustomSwal{

    private swal;

    constructor(){
        this.swal = sweetalert2;
    }

    info(msg: string){
        this.swal.fire({
            title: 'Info',
            text: msg,
            icon: 'info'            
        });
    }

    success(msg: string){
        this.swal.fire({
            title: 'Success',
            text: msg,
            icon: 'success'
        });
    }

    error(msg: string){
        this.swal.fire({
            title: 'Error',
            text: msg,
            icon: 'error'
        });
    }

    warning(msg: string){
        this.swal.fire({
            title: 'Warning',
            text: msg,
            icon: 'warning'
        });
    }

    question(msg: string){
        this.swal.fire({
            title: 'Question',
            text: msg,
            icon: 'question'
        });
    }

    async fire(options: SweetAlertOptions): Promise<SweetAlertResult>{
        return this.swal.fire(options);
    }

}

export default new CustomSwal;