import React from 'react';
import Sidebar from './sidebar/Sidebar';
import MessageContainer from './messages/MessageContainer';

const ChattingSetup = () => {
    return (
        <div
            className="flex h-screen w-full bg-cover bg-center relative p-4"
            style={{
                backgroundImage: `url('/bg.avif')`
            }}
        >
            {/* White Blur Overlay */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>

            {/* Main Content */}
            <div className="relative z-10 flex w-full p-2 gap-4 h-full">
                {/* Sidebar */}
                <div className="w-1/4 lg:w-1/5 bg-white/60 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
                    <Sidebar />
                </div>

                {/* Messages */}
                <div className="flex-1 bg-white/60 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
                    <MessageContainer />
                </div>
            </div>
        </div>
    );
};

export default ChattingSetup;
