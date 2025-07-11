import React from 'react';
import Messages from './MessageSetup/Messages';
import SendInput from './MessageSetup/SendInput';
import { useSelector } from 'react-redux';

const ChatHeader = () => {
  const { selectedUser } = useSelector(store => store.auth);

  if (!selectedUser) {
    return (
      <div className="p-4 border-b border-gray-700 bg-white/50 rounded-t-lg text-center">
        <h2 className="text-lg text-gray-600 dark:text-gray-300">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-700 bg-white/50 rounded-t-lg flex items-center gap-4">
      <img
        src={selectedUser.profile?.profilePhoto || '/default-profile.png'}
        alt="User"
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
      />
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedUser.fullname}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 truncate">{selectedUser.email}</p>
      </div>
    </div>
  );
};

const MessageContainer = () => {
  const { selectedUser } = useSelector(store => store.auth);

  return (
    <div className="flex flex-col h-full border rounded-lg shadow text-white">
      <ChatHeader />
      {selectedUser ? (
        <>
          <Messages />
          <SendInput />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-300 p-6">
          Please select a user to start chatting.
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
