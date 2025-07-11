import React from 'react';
import MessageCard from './MessageCard';
import useGetMessages from '@/hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '@/hooks/useGetRealTimeMessages';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage()
    const messages = useSelector(store => store.messages.list);

    if (!Array.isArray(messages) || messages.length === 0) {
        return <p className="p-4 text-gray-400">No messages yet.</p>;
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
            {messages.map(msg => (
                <MessageCard key={msg._id} message={msg} />
            ))}
        </div>
    );
};

export default Messages;