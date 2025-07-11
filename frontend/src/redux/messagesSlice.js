// src/redux/messagesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        list: []
    },
    reducers: {
        setMessages: (state, action) => {
            state.list = action.payload;
        },
        addMessage: (state, action) => {
            state.list.push(action.payload);
        }
    }
});
export const { setMessages, addMessage } = messagesSlice.actions // ✅ Correct
export default messagesSlice.reducer
