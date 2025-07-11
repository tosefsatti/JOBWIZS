// src/redux/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        instance: null,    // ← call this “instance” (not “socket” or “list”)
    },
    reducers: {
        setSocket: (state, action) => {
            state.instance = action.payload;
        },
        clearSocket: (state) => {
            state.instance = null;
        },
    },
});

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
