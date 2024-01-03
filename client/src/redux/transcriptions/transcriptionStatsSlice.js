import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    transcriptionStats: null,
};

const transcriptionStatsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        setTranscriptionStats: (state, action) => {
            state.transcriptionStats = action.payload;
        },
        // deleteTranscription: (state, action) => {
        //     console.log(`action.payload = ${action.payload}`);
        //     state.currentTranscription = state.currentTranscription.transcriptions.filter((item) => item._id !== action.payload);
        // },
        clearTranscriptionStats: (state) => {
            state.transcriptionStats = null;
        },
    }
});

export const { setTranscriptionStats, clearTranscriptionStats } = transcriptionStatsSlice.actions;

export default transcriptionStatsSlice.reducer;