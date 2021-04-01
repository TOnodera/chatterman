import swal from '../../util/swal';
import socketStore from '../Socket';
class ServerException{

    launchListener(){
        this.domainExceptionListener();
        this.authenticationExceptionListener();
    }

    domainExceptionListener(){
        socketStore.socket.on('occurred:domain-exception',(message: string)=>{
            this.domainExceptionHandler(message);
        });
    }

    authenticationExceptionListener(){
        socketStore.socket.on('occurred:authentication-exception',(message: string)=>{
            this.authenticationExceptionHandler(message);
        });
    }

    domainExceptionHandler(message: string){
        swal.fire(message);
    }

    authenticationExceptionHandler(message: string){
        swal.fire(message);
    }
}

export default new ServerException();