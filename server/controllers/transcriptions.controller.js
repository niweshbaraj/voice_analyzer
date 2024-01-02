import { errorHandler } from "../utils/error.js";
import Transcription from "../models/transcription.model.js";

// get trancripts

export const getTranscriptions = async (req, res, next) => {
    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "You can only save your trasncriptions!"));
    }
    const userId = req.user._id;
    try {
        const transcriptions = await Transcription.find({ userId });
        res.status(200).json({ transcriptions });
    }catch (error) {
        console.error('Error getting transcriptions:', error);
        next(error);
  }
};

// save transcript

export const saveTranscription = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return next(errorHandler(401, "You can only save your trasncriptions!"));
  }
  const userId = req.user._id;
  const { transcription } = req.body;
  try {
    const newTranscription = new Transcription({
      userId,
      transcription,
    });
    await newTranscription.save();
    res.status(201).json({ message: "Trasncription saved successfully" });
  } catch (error) {
    console.error("Error transcribing speech: ", error);
    // res.status(500).json({ error: 'Internal Server Error' });
    next(error);
  }
};

// delete transcript

export const deleteTranscription = async (req, res, next) => {
    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your transcription!"));
    }
    const trans_id = req.params.t_id;
    try {
        await Transcription.findByIdAndDelete(trans_id);
        res.status(200).json("Trasncription has been deleted...");
    } catch (error) {
        console.error('Error deleting transcription:', error);
        next(error);
    }
};