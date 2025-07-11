// src/redux/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";
import messagesSlice from "./messagesSlice";
import socketSlice from "./socketSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import requestReducer from "./requestSlice";
import storage from 'redux-persist/lib/storage';

// 1) Which slices to persist (we explicitly skip auth, messages, socket)
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    // blacklist: ['messages', 'socket'],
    blacklist: [''],
};

const rootReducer = combineReducers({
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice,
    messages: messagesSlice,
    socket: socketSlice,
    requests: requestReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // 2) Bypass serializability warnings for Redux‑Persist actions...
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            // 3) …and also ignore just the one non‑serializable field in our socket slice:
            serializableCheck: {
                ignoredPaths: ['socket.instance'],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
