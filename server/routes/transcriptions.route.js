import express from 'express';
import { getTranscriptions, saveTranscription, deleteTranscription } from '../controllers/transcriptions.controller.js';
import { transcriptionStats } from '../controllers/transcriptionsStats.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/getTranscriptions/:id', verifyToken , getTranscriptions);
router.post('/saveTranscription/:id', verifyToken, saveTranscription);
router.delete('/deleteTranscription/:id/:t_id', verifyToken, deleteTranscription);

router.get('/getStats/:id', verifyToken, transcriptionStats);

export default router;