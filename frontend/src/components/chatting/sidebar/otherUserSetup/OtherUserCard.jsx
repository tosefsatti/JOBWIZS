import { setSelectedUser } from '@/redux/authSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const OtherUserCard = ({ user }) => {
    const dispatch = useDispatch();
    const { onlineUsers, selectedUser } = useSelector(store => store.auth);
    const isOnlineUser = onlineUsers.includes(user?._id);
    const isSelected = selectedUser?._id === user._id;

    const handleSelectUser = () => {
        dispatch(setSelectedUser(user));
    };

    return (
        <div
            onClick={handleSelectUser}
            className={`flex items-center gap-4 px-2 py-6 cursor-pointer transition duration-200 rounded-lg
        ${isSelected ? 'bg-blue-300 dark:bg-blue-800' : 'bg-white/30 dark:bg-gray-800'} 
        hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md`}
        >
            <div className="relative">
                <img
                    src={user.profile?.profilePhoto || '/default-profile.png'}
                    alt="profile"
                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
                <span
                    className={`absolute top-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 
            ${isOnlineUser ? 'bg-green-700' : 'bg-gray-400'}`}
                ></span>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.fullname}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 truncate">{user.email}</p>
            </div>
        </div>
    );
};


export default OtherUserCard;
