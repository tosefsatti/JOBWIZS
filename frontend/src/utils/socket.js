// utils/socket.js
import { io } from 'socket.io-client';

let socket;

export const connectSocket = (userId) => {
    if (!socket) {
        socket = io('http://localhost:8000', {
            query: { userId },
            withCredentials: true,
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
