import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/redux/messagesSlice';

const useGetMessages = () => {
    const dispatch = useDispatch();
    const { user, selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchConversation = async () => {
            if (!user?._id || !selectedUser?._id) return;
            try {
                axios.defaults.withCredentials = true;
                // fetch messages where current user is receiver
                const res1 = await axios.get(
                    `http://localhost:8000/api/v1/message/${user._id}`
                );
                // fetch messages where current user is sender
                const res2 = await axios.get(
                    `http://localhost:8000/api/v1/message/${selectedUser._id}`
                );
                // combine both and filter only those between these two
                const all = [...res1.data.messages, ...res2.data.messages]
                    .filter(m =>
                        (m.senderId === user._id && m.receiverId === selectedUser._id) ||
                        (m.senderId === selectedUser._id && m.receiverId === user._id)
                    )
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                dispatch(setMessages(all));
            } catch (err) {
                console.error(err);
            }
        };
        fetchConversation();
    }, [user, selectedUser, dispatch]);
};

export default useGetMessages;
