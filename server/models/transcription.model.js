import mongoose from "mongoose";

const transcriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    transcription: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Transcription = mongoose.model('transcription', transcriptionSchema);

export default Transcription;