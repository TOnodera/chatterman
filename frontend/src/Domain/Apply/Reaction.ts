import socketStore from '../Socket';
class Reaction{

    approve(unique_id: number,user_id: string){
        socketStore.socket.emit('user:apply-reaction-approve',unique_id,user_id);
    }

    deny(unique_id: number,user_id: string){
        socketStore.socket.emit('user:apply-reaction-deny',unique_id,user_id);
    }

}

export default new Reaction;