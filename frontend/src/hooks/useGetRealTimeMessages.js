import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messagesSlice';

const useGetRealTimeMessages = () => {
    // directly select the socket instance
    const socket = useSelector(store => store.socket.socket);
    const dispatch = useDispatch();

    useEffect(() => {
        // guard: only attach if socket has .on
        if (!socket || typeof socket.on !== 'function') return;

        const handleNew = (newMessage) => {
            dispatch(setMessages(prevMessages => [...prevMessages, newMessage]));
        };

        socket.on('newMessage', handleNew);
        return () => {
            socket.off('newMessage', handleNew);
        };
    }, [socket, dispatch]);
};

export default useGetRealTimeMessages;