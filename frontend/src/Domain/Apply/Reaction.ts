import { APPLY_REACTIONS } from '@/Enum';
import socketStore from '../Socket';
class Reaction{

    approve(unique_id: number,user_id: string){
        console.log(APPLY_REACTIONS.APPROVE,APPLY_REACTIONS.DENY);
        socketStore.socket.emit('user:apply-reaction-approve',unique_id,user_id,APPLY_REACTIONS.APPROVE);
    }

    deny(unique_id: number,user_id: string){
        console.log(APPLY_REACTIONS.APPROVE,APPLY_REACTIONS.DENY);

        socketStore.socket.emit('user:apply-reaction-deny',unique_id,user_id,APPLY_REACTIONS.DENY);
    }

}

export default new Reaction;