import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/userSlice.js';
import transcriptionReducer from './transcriptions/transcriptionSlice.js';
import transcriptionStatsReducer from './transcriptions/transcriptionStatsSlice.js';

const rootReducer = combineReducers({
    user: userReducer,
    transcription: transcriptionReducer,
    stats: transcriptionStatsReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);