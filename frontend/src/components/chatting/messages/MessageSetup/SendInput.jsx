import React, { useState } from 'react';
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from '@/redux/messagesSlice';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);
    const messages = useSelector(store => store.messages.list);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/message/send/${selectedUser?._id}`,
                { message },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            dispatch(addMessage(res.data.newMessage));
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='border-t border-gray-700'>
            <div className='relative '>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Send a message...'
                    className='w-full pr-10 text-sm rounded-lg p-3 bg-gray-600 text-white border border-zinc-500'
                />
                <button type="submit" className='absolute inset-y-0 right-0 flex items-center pr-3'>
                    <IoSend size={20} />
                </button>
            </div>
        </form>
    );
};

export default SendInput;