import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const MessageCard = ({ message }) => {
    const { user } = useSelector(store => store.auth);
    const isOwn = message.senderId === user?._id;
    const alignment = isOwn ? 'self-end bg-green-200 dark:bg-green-700' : 'self-start bg-blue-200 dark:bg-blue-700';

    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={scrollRef}
            className={`${alignment} p-3 rounded-lg max-w-md`}
        >
            <p className="text-sm text-gray-900 dark:text-white">{message.message}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 text-right">
                {new Date(message.createdAt).toLocaleTimeString()}
            </p>
        </div>
    );
};

export default MessageCard;
