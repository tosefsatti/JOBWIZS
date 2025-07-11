// src/redux/requestSlice.js
import { createSlice } from '@reduxjs/toolkit';

const requestSlice = createSlice({
    name: 'requests',
    initialState: {
        sentRequests: [],     // array of receiverIds
        receivedRequests: [], // array of requesterIds
        friends: [],          // array of friendIds
    },
    reducers: {
        sendRequest: (state, action) => {
            const userId = action.payload;
            if (!state.sentRequests.includes(userId)) {
                state.sentRequests.push(userId);
            }
        },
        receiveRequest: (state, action) => {
            const userId = action.payload;
            if (!state.receivedRequests.includes(userId)) {
                state.receivedRequests.push(userId);
            }
        },
        acceptRequest: (state, action) => {
            const userId = action.payload;
            // remove from received
            state.receivedRequests = state.receivedRequests.filter(id => id !== userId);
            // add to friends
            if (!state.friends.includes(userId)) {
                state.friends.push(userId);
            }
        },
        declineRequest: (state, action) => {
            const userId = action.payload;
            state.receivedRequests = state.receivedRequests.filter(id => id !== userId);
        },
        setSentRequests: (state, action) => {
            state.sentRequests = action.payload;
        },
        setReceivedRequests: (state, action) => {
            state.receivedRequests = action.payload;
        },
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
    }
});

export const {
    sendRequest,
    receiveRequest,
    acceptRequest,
    declineRequest,
    setSentRequests,
    setReceivedRequests,
    setFriends
} = requestSlice.actions;

export default requestSlice.reducer;
