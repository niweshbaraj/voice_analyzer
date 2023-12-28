import mongoose from "mongoose";

const transcriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text:{
        type: String,
        required: true,
    },
})

const Transcription = mongoose.model('transcription', transcriptionSchema);

export default Transcription;