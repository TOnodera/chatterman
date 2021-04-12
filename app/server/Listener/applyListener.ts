
import { Socket } from "socket.io";
import ApplyController from '../Domain/Controller/ApplyController';

module.exports = (socket: Socket) => {

    const applyController = new ApplyController(socket);

    const applyReaction = async (unique_id: string,user_id: string,reaction: number) => {
        await applyController.reaction(unique_id,user_id,reaction);
    }

    socket.on('user:apply-reaction', applyReaction);
};
