// src/components/sidebar/OtherUsers.jsx
import React from 'react';
import OtherUserCard from './OtherUserCard';
import useGetOtherUsers from "@/hooks/userGetOtherUsers";
import { useSelector } from 'react-redux';

const OtherUsers = () => {
    useGetOtherUsers();
    const allUsers = useSelector(store => store.auth.getUser);
    const friends = useSelector(store => store.requests.friends);
    // friends is an array of user‑IDs

    // only show those users whose _id is in the friends list
    const chatable = React.useMemo(
        () => Array.isArray(allUsers)
            ? allUsers.filter(user => friends.includes(user._id))
            : [],
        [allUsers, friends]
    );

    if (!chatable.length) {
        return <p className="text-center mt-4 text-gray-700">No friends to chat with.</p>;
    }

    return (
        <div className="flex flex-col gap-y-4 p-4">
            {chatable.map(user => (
                <OtherUserCard key={user._id} user={user} />
            ))}
        </div>
    );
};

export default OtherUsers;
