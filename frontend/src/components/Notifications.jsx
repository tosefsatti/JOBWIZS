// src/components/Notifications.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import {
    acceptRequest,
    declineRequest,
    setReceivedRequests
} from '@/redux/requestSlice';
import { Button } from './ui/button';
import Navbar from './shared/Navbar';

const Notifications = () => {
    const dispatch = useDispatch();
    const incoming = useSelector(state => state.requests.receivedRequests);

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/friends/incoming', { withCredentials: true })
            .then(({ data }) => {
                // data is populated with requester.fullname
                dispatch(setReceivedRequests(data));
            })
            .catch(() => toast.error('Failed to load notifications'));
    }, [dispatch]);

    const handleResponse = (requestId, requesterId, action) => {
        axios.patch(
            `http://localhost:8000/api/v1/friends/respond/${requestId}`,
            { action },
            { withCredentials: true }
        )
            .then(() => {
                if (action === 'accepted') {
                    dispatch(acceptRequest({ requesterId, requestId }));
                    toast.success('Friend request accepted');
                } else {
                    dispatch(declineRequest(requestId));
                    toast.success('Friend request declined');
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Action failed');
            });
    };

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto mt-10">
                <h1 className="text-3xl font-bold mb-6">Notifications</h1>

                {incoming.length === 0 ? (
                    <p className="text-gray-500">No new requests.</p>
                ) : incoming.map(req => (
                    <div
                        key={req._id}
                        className="flex items-center justify-between p-4 mb-2 bg-white rounded shadow"
                    >
                        {/* Directly print the populated fullname */}
                        <p className="font-medium">
                            {req.requester.fullname}
                        </p>
                        <div className="space-x-2">
                            <Button onClick={() => handleResponse(req._id, req.requester._id, 'accepted')}>
                                Accept
                            </Button>
                            <Button onClick={() => handleResponse(req._id, req.requester._id, 'declined')}>
                                Decline
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Notifications;
