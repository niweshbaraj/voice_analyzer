import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTranscription: null,
};

const transcriptionSlice = createSlice({
    name: "transcription",
    initialState,
    reducers: {
        setTranscription: (state, action) => {
            state.currentTranscription = action.payload;
        },
        // deleteTranscription: (state, action) => {
        //     console.log(`action.payload = ${action.payload}`);
        //     state.currentTranscription = state.currentTranscription.transcriptions.filter((item) => item._id !== action.payload);
        // },
        clearTranscription: (state) => {
            state.currentTranscription = null;
        },
    }
});

export const { setTranscription, clearTranscription } = transcriptionSlice.actions;

export default transcriptionSlice.reducer;