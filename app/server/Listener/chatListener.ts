import { RoomAndUserId } from "server/@types/types";
import logger from "../Domain/Utility/logger";
import { Socket } from "socket.io";
import messageController from '../Domain/Controller/MessasgeController';
import roomController from '../Domain/Controller/RoomController';

module.exports = (socket: Socket) => {

    const userSendMessage = async (fromClient: any) => {
        await messageController.add(fromClient.message, fromClient.user.id, fromClient.room_id, socket);
    };

    const userEditMessage = async (fromClient: any) => {

        console.log('userSendMessage...');

    };

    const deleteMessage = (fromClient: any) => {

        console.log('deleteMessage...');

    };

    const attemptToEnter = async (info: RoomAndUserId) => {
        logger.info(`attempot to enter... user:${info.user_id} -> room:${info.room_id}`);
        await roomController.attemptToEnter(info, socket);
    };

    const leaveCurrentRoom = async (info: RoomAndUserId) => {
        await roomController.leaveCurrentRoom(info, socket);
    }

    const userTyping = (user: { id: string, name: string }) => {
        messageController.typing(user, socket);
    };

    const moreMessages = (room_id: string, message_id: string) => {
        console.log('moreMessages');
        messageController.moreMessages(room_id, message_id, socket);
    }

    const latestMessages = (room_id: string) => {
        messageController.getLatest(room_id, socket);
    }

    socket.on('user:send-message', userSendMessage);
    socket.on('user:edit-message', userEditMessage);
    socket.on('user:delete-message', deleteMessage);
    socket.on('user:attempt-to-enter-room', attemptToEnter);
    socket.on('user:leave-room', leaveCurrentRoom);
    socket.on('user:typing', userTyping);
    socket.on('user:latest-messages', latestMessages);
    socket.on('user:more-messages', moreMessages);

};
