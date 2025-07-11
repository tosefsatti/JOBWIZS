import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        getUser: [],
        selectedUser: null,
        onlineUsers: [],
    },
    reducers: {
        // actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setGetUser: (state, action) => {
            state.getUser = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setOnlineUser: (state, action) => {
            state.onlineUsers = action.payload
        }

    }
});
export const { setLoading, setUser, setGetUser, setSelectedUser, setOnlineUser } = authSlice.actions;
export default authSlice.reducer;