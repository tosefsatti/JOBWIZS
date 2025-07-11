import React, { useState } from 'react';
import OtherUsers from "./otherUserSetup/OtherUsers";
import { Menu, X } from 'lucide-react';
import { useMediaQuery } from './UseMediaQuery';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Close sidebar when clicking outside (for mobile)
    const handleClickOutside = (e) => {
        if (isMobile && isOpen && !e.target.closest('.sidebar-content')) {
            setIsOpen(false);
        }
    };

    // Close sidebar automatically on mobile when a user is selected
    const handleUserSelect = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile toggle button */}
            {isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed left-4 top-4 z-40 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            )}

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar content */}
            <div
                className={`sidebar-content bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                    ${isMobile ?
                        `fixed top-0 left-0 h-full w-64 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
                        : 'w-64 h-screen sticky top-0'}`}
                onClick={handleClickOutside}
            >
                <div className="h-full overflow-y-auto p-4">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white px-2">
                        {isMobile ? 'Chat Users' : 'Online Users'}
                    </h2>
                    <div onClick={handleUserSelect}>
                        <OtherUsers />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;