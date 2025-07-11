import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useGetOtherUsers from '@/hooks/userGetOtherUsers';
import axios from 'axios';
import { toast } from 'sonner';
import {
    sendRequest,
    setSentRequests,
    setFriends
} from '@/redux/requestSlice';
import { Button } from './ui/button';
import Navbar from './shared/Navbar';

const Friends = () => {
    const dispatch = useDispatch();
    // always get an array
    const { others = [] } = useGetOtherUsers();

    // raw stored request objects
    const sentRequests = useSelector(state => state.requests.sentRequests);
    // safely extract just the receiver IDs
    const sent = Array.isArray(sentRequests)
        ? sentRequests.map(r => r.receiver?._id).filter(Boolean)
        : [];

    const friends = useSelector(state => state.requests.friends);

    useEffect(() => {
        // load outgoing (pending) requests
        axios.get('http://localhost:8000/api/v1/friends/outgoing', { withCredentials: true })
            .then(({ data }) => {
                dispatch(setSentRequests(data)); // data is array of { _id, receiver: {...} }
            })
            .catch(() => toast.error('Failed to load sent requests'));

        // load confirmed friends
        axios.get('http://localhost:8000/api/v1/friends/friends', { withCredentials: true })
            .then(({ data }) => {
                dispatch(setFriends(data.friends)); // data.friends is array of user IDs
            })
            .catch(() => toast.error('Failed to load friends'));
    }, [dispatch]);

    const handleSend = userId => {
        axios.post(`http://localhost:8000/api/v1/friends/send/${userId}`, {}, { withCredentials: true })
            .then(({ data }) => {
                dispatch(sendRequest(data.fr)); // data.fr is the new FriendRequest object
                toast.success(data.message);
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Send failed');
            });
    };

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto mt-10">
                <h1 className="text-3xl font-bold mb-6">People You May Know</h1>
                {others.map(user => {
                    const alreadySent = sent.includes(user._id);
                    const isFriend = friends.includes(user._id);

                    return (
                        <div
                            key={user._id}
                            className="flex items-center justify-between p-4 mb-2 bg-white rounded shadow"
                        >
                            <div>
                                <p className="text-lg font-semibold ">{user.fullname}</p>
                                <p className="text-sm text-gray-500">
                                    {user.profile?.bio || 'No bio'}
                                </p>
                            </div>
                            <Button
                                disabled={alreadySent || isFriend}
                                onClick={() => handleSend(user._id)}
                                className={`
    transition-all duration-300 ease-in-out
    ${isFriend
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : alreadySent
                                            ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                                            : 'bg-sky-500 text-white hover:bg-sky-600'}
  `}
                            >
                                {isFriend ? 'Friends' : alreadySent ? 'Pending' : 'Send Request'}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Friends;
